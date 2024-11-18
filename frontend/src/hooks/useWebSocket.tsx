"use client";

import { Solution, TabuMove, TreeNode } from "@/common/types";
import { useAlgorithm } from "@/context/AlgorithmContext";
import { useTaskContext } from "@/context/TaskContext";
import { Client, Frame, IMessage } from "@stomp/stompjs";
import { createContext, useCallback, useContext, useRef, useState } from "react";


export const BROKER_URL = "ws://localhost:8080/api/rpq/websocket";
export const SOLUTION_TOPIC = "/scheduler/solution/";
export const READY_TOPIC = "/app/scheduler/ready";
export const STOP_ALGORITHM_TOPIC = "/app/scheduler/stop";

// Simulated Annealing
export const RESET_TEMPERATURE_TOPIC = "/app/scheduler/sa/reset_temperature";
export const STOP_TEMPERATURE_CHANGE_TOPIC =
  "/app/scheduler/sa/stop_temperature_change";
export const UPDATE_PARAMETERS_TOPIC = "/app/scheduler/parameters";

// Tabu Search
export const RESET_TABU_LIST_TOPIC = "/app/scheduler/ts/clear_tabu_list";

interface WebSocketContextProps {
  connect: (id: string) => void;
  disconnect: () => void;
  sendResetTemperature: () => void;
  clearTabuList: () => void;
  sendStopTemperatureChange: () => void;
  stopAlgorithm: () => void;
  sendUpdateCoolingRate: (coolingRate: number) => void;
  sendUpdateTabuListSize: (tabuListSize: number) => void;
  sendUpdateInitialTenure: (initialTenure: number) => void;
  isConnected: boolean;
  sessionId: string;
};

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const WebSocketProvider: React.FC<React.PropsWithChildren<{}>> = ({children,}) => {
  const clientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [stopTemperatureChangeFlag, setStopTemperatureChangeFlag] = useState<boolean>(true);

  const { updateSimulatedAnnealingSolution, updateTabuSearchSolution, setIsDataFetchingCompleted, updateSchrageSolution, updateCarlierSolution } = useTaskContext();
  const { currentAlgorithm } = useAlgorithm();

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.deactivate();
      setIsConnected(false);
    }
  }, []);

  const onMessage = (message: IMessage) => {
    try {
      if (message.body === "FINISHED") {
        disconnect();
        setIsDataFetchingCompleted(true);
        return;
      }
      mapToSolution(message);
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  };

  const connect = useCallback(
    (id: string) => {
      if (clientRef.current && clientRef.current.active) {
        console.log("WebSocket is already connected");
        return;
      }

      const client = new Client({
        brokerURL: BROKER_URL,
        reconnectDelay: 5000,
      });

      clientRef.current = client;

      client.onConnect = (frame: Frame) => {
        console.log("Connected: " + frame);
        setSessionId(id);
        client.publish({ destination: READY_TOPIC, body: id });

        client.subscribe(SOLUTION_TOPIC + id, (message: IMessage) => {
          onMessage(message);
        });

        setIsConnected(true);
      };

      client.onStompError = (frame: Frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      };

      client.onWebSocketClose = () => {
        console.log("WebSocket connection closed");
        setIsConnected(false);
      };

      client.onWebSocketError = (error: any) => {
        console.error("WebSocket error:", error);
      };

      client.activate();
    },
    [onMessage]
  );

  const sendResetTemperature = () => {
    clientRef.current?.publish({
      destination: RESET_TEMPERATURE_TOPIC,
      body: sessionId,
    });
  };

  const clearTabuList = () => {
    clientRef.current?.publish({
      destination: RESET_TABU_LIST_TOPIC,
      body: sessionId,
    });
  };

  const sendStopTemperatureChange = () => {
    clientRef.current?.publish({
      destination: STOP_TEMPERATURE_CHANGE_TOPIC,
      body: JSON.stringify({ sessionId, reset: stopTemperatureChangeFlag }),
    });
    setStopTemperatureChangeFlag(!stopTemperatureChangeFlag);
  };

  const stopAlgorithm = () => {
    clientRef.current?.publish({
      destination: STOP_ALGORITHM_TOPIC,
      body: sessionId,
    });
  };

  const sendUpdateCoolingRate = (coolingRate: number) => {
    const message = JSON.stringify({
      sessionId: sessionId,
      parameters: { coolingRate },
    });
    clientRef.current?.publish({
      destination: UPDATE_PARAMETERS_TOPIC,
      body: message,
    });
  };

  const sendUpdateTabuListSize = (tabuListSize: number) => {
    const message = JSON.stringify({
      sessionId: sessionId,
      parameters: { tabuListSize },
    });
    clientRef.current?.publish({
      destination: UPDATE_PARAMETERS_TOPIC,
      body: message,
    });
  };

  const sendUpdateInitialTenure = (initialTenure: number) => {
    const message = JSON.stringify({
      sessionId: sessionId,
      parameters: { initialTenure },
    });
    clientRef.current?.publish({
      destination: UPDATE_PARAMETERS_TOPIC,
      body: message,
    });
  }

  const mapToSolution = (message: IMessage) => {
    let data;
    try {
      switch (currentAlgorithm) {
        case "SimulatedAnnealing":
          data = JSON.parse(message.body);
          const probabilities: Array<number> = data.probabilities;
          const temperatures: Array<number> = data.temperatures;
          const saSolutions: Array<Solution> = data.permutations.map(
            (solution) => ({
              cmax: solution.cmax,
              order: solution.permutation,
            })
          );
          updateSimulatedAnnealingSolution(saSolutions, temperatures, probabilities);
          break;
        case "TabuSearch":
          data = JSON.parse(message.body);
          const tabuList: Array<TabuMove> = data.tabuList.map((move, id) => ({
            id,
            firstTaskId: move.firstTask,
            secondTaskId: move.secondTask,
            moveCmax: move.moveCmax,
            tenure: move.tenure,
          }));
          const tabuSolutions: Array<Solution> = data.permutations.map(
            (solution) => ({
              cmax: solution.cmax,
              order: solution.permutation,
            })
          );
          updateTabuSearchSolution(tabuSolutions, tabuList);
          break;
          case "SchrageAlgorithm":
            data = JSON.parse(message.body);
            const schrageSolutions: Array<Solution> = data.permutations.map(
              (solution) => {
                return {
                  cmax: solution.cmax,
                  order: solution.permutation,
                } as Solution;
              }
            );
            const notReadyQueue: Array<number> = data.notReadyQueue;
            const readyQueue: Array<number> = data.readyQueue;
            const bestSolutionSchrage: Solution = {
              cmax: data.bestSolution.bestCmax,
              order: data.bestSolution.bestOrder,
            } as Solution;

            updateSchrageSolution(
              schrageSolutions,
              notReadyQueue,
              readyQueue,
              bestSolutionSchrage
            );
            break;
          case "CarlierAlgorithm":
              data = JSON.parse(message.body);
              console.log("Carlier data:", data);
    
              const carlierSolutions: Array<Solution> = data.permutations.map(
                (solution) => {
                  return {
                    cmax: solution.cmax,
                    order: solution.permutation,
                  } as Solution;
                }
              );
    
              const bestSolutionCarlier: Solution = {
                cmax: data.bestSolution.bestCmax,
                order: data.bestSolution.bestOrder,
              };
    
              // Root node of the tree
              const rootNode: TreeNode = {
                "@id": data.node["@id"],
                parent: data.node.parent,
                children: data.node.children,
                permutation: {
                  cmax: data.node.permutation.cmax,
                  order: data.node.permutation.permutation,
                },
                ub: data.node.ub,
                lb: data.node.lb,
                pruned: data.node.pruned,
                active: data.node.active,
              };
    
              updateCarlierSolution(carlierSolutions, rootNode, bestSolutionCarlier);
              break;
          default:
            throw new Error(`Algorithm ${currentAlgorithm} not supported`);
        }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  };

  const value = {
    connect,
    disconnect,
    sendResetTemperature,
    clearTabuList,
    sendStopTemperatureChange,
    stopAlgorithm,
    sendUpdateCoolingRate,
    sendUpdateTabuListSize,
    sendUpdateInitialTenure,
    isConnected,
    sessionId,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocketContext must be used within a WebSocketProvider");
  }
  return context;
};
