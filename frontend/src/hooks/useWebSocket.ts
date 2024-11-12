import { useRef, useState, useCallback, useEffect } from "react";
import { Client, Frame, IMessage } from "@stomp/stompjs";
import { useTaskContext } from "@/context/TaskContext";
import { useAlgorithm } from "@/context/AlgorithmContext";
import { Solution, TabuMove, TreeNode } from "@/common/types";

export const BROKER_URL = 'ws://localhost:8080/api/rpq/websocket';
export const SOLUTION_TOPIC = '/scheduler/solution/';
export const READY_TOPIC = '/app/scheduler/ready';
export const STOP_ALGORITHM_TOPIC = '/app/scheduler/stop';

// Simulated Annealing
export const RESET_TEMPERATURE_TOPIC = '/app/scheduler/sa/reset_temperature';
export const STOP_TEMPERATURE_CHANGE_TOPIC = '/app/scheduler/sa/stop_temperature_change';
export const UPDATE_COOLING_RATE_TOPIC = '/app/scheduler/parameters';

// Tabu Search
export const RESET_TABU_LIST_TOPIC = '/app/scheduler/ts/clear_tabu_list';


const useWebSocket = () => {
  const clientRef = useRef<Client | null>(null);

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');
  const { updateSimulatedAnnealingSolution, updateTabuSearchSolution, setIsDataFetchingCompleted, updateSchrageSolution, updateCarlierSolution } = useTaskContext();
  const { currentAlgorithm } = useAlgorithm();


  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.deactivate();
      setIsConnected(false);

    }
  }, []);

  const onMessage = (message) => {
    try {
      if (message.body === "FINISHED") {
        disconnect();
        setIsDataFetchingCompleted(true);
        return;
      }
      mapToSolution(message);
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  const connect = useCallback((id: string) => {
    if (clientRef.current && clientRef.current.active) {
      console.log("WebSocket is already connected");
      return;
    }

    const client = new Client({
      brokerURL: BROKER_URL,
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
    });

    clientRef.current = client;

    client.onConnect = (frame: Frame) => {
      console.log("Connected: " + frame);

      console.log("SessionId:", id);
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
  }, [sessionId, onMessage]);

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

  const sendStopTemperatureChange = (reset: boolean) => {
    const message = JSON.stringify({
      sessionId: sessionId,
      reset: reset,
    });
    clientRef.current?.publish({
      destination: STOP_TEMPERATURE_CHANGE_TOPIC,
      body: message,
    });
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
      parameters: {
        coolingRate: coolingRate,
      },
    });
    clientRef.current?.publish({
      destination: UPDATE_COOLING_RATE_TOPIC,
      body: message,
    });
  };

  const mapToSolution = (message: IMessage): void => {
    let data;
    try {
      switch (currentAlgorithm) {
        case 'SimulatedAnnealing':
          data = JSON.parse(message.body);
          const probabilities: Array<number> = data.probabilities;
          const temperatures: Array<number> = data.temperatures;
          const saSolutions: Array<Solution> = data.permutations.map((solution) => {
            return {
              cmax: solution.cmax,
              order: solution.permutation,
            } as Solution;
          }); 
          updateSimulatedAnnealingSolution(saSolutions, temperatures, probabilities);
          break;
        case 'TabuSearch':
          data = JSON.parse(message.body);
          const tabuList: Array<TabuMove> = data.tabuList.map((move, id) => {
            return {
              id: id,
              firstTaskId: move.firstTask,
              secondTaskId: move.secondTask,
              moveCmax: move.moveCmax,
              tenure: move.tenure,
            } as TabuMove;
          });
          const tabuSolutions: Array<Solution> = data.permutations.map((solution) => {
            return {
              cmax: solution.cmax,
              order: solution.permutation,
            } as Solution;
          });
          updateTabuSearchSolution(tabuSolutions, tabuList);
          break;
        case 'SchrageAlgorithm':
          data = JSON.parse(message.body);
          const scSolutions: Array<Solution> = data.permutations.map((solution) => {
            return {
              cmax: solution.cmax,
              order: solution.permutation,
            } as Solution;
          }); 
          const notReadyQueue: Array<number> = data.notReadyQueue;
          const readyQueue: Array<number> = data.readyQueue;
          const bestSolutionSchrage: Solution = {
            cmax: data.bestSolution.bestCmax,
            order: data.bestSolution.bestOrder,
        } as Solution;
          updateSchrageSolution(scSolutions, notReadyQueue, readyQueue, bestSolutionSchrage);
          break;
          case 'CarlierAlgorithm':
            data = JSON.parse(message.body);
            console.log('Carlier data:', data);
    
            //Extract best solution
            const bestSolutionCarlier: Solution = {
              cmax: data.bestSolution.bestCmax,
              order: data.bestSolution.bestOrder,
            };
    
            // Upper bound
            const ubCarlier: number = data.ub;
    
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
            }
    
            updateCarlierSolution([], rootNode);
          break;
        default:
          throw new Error(`Algorithm ${currentAlgorithm} not supported`);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  return {
    connect,
    disconnect,
    sendResetTemperature,
    clearTabuList,
    sendStopTemperatureChange,
    stopAlgorithm,
    sendUpdateCoolingRate,
    setSessionId,
    isConnected,
  };
};

export default useWebSocket;
