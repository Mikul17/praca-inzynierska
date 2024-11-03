package org.mikul17.rpq.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mikul17.rpq.api.enums.AlgorithmName;
import org.mikul17.rpq.api.request.ScheduleRequest;
import org.mikul17.rpq.exceptions.UnableToStartConnectionException;
import org.mikul17.rpq.services.AlgorithmService;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@SpringBootTest
@AutoConfigureMockMvc
class AlgorithmControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AlgorithmService algorithmService;

    @Test
    void shouldStartAlgorithm() throws Exception {
        ScheduleRequest request = new ScheduleRequest(AlgorithmName.CARLIER, null, null);

        doNothing().when(algorithmService).startAlgorithm(any(ScheduleRequest.class), anyString());

        mockMvc.perform(MockMvcRequestBuilders.post("/start_scheduling")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string(org.hamcrest.Matchers.containsString("Connection request sent, session id: ")));

        verify(algorithmService, Mockito.times(1)).startAlgorithm(any(ScheduleRequest.class), anyString());
    }

    @Test
    void shouldThrowUnableToStartConnectionException () throws Exception {
        ScheduleRequest request = new ScheduleRequest(AlgorithmName.SIMULATED_ANNEALING, null, null);

        doThrow(new UnableToStartConnectionException("Error starting algorithm")).when(algorithmService).startAlgorithm(any(ScheduleRequest.class), anyString());

        mockMvc.perform(MockMvcRequestBuilders.post("/start_scheduling")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(MockMvcResultMatchers.status().isInternalServerError())
                .andExpect(MockMvcResultMatchers.content().string("Error starting algorithm"));

        verify(algorithmService, Mockito.times(1)).startAlgorithm(any(ScheduleRequest.class), anyString());
    }

    @Test
    void shouldThrowUnsupportedOperationException () throws Exception {
        ScheduleRequest request = new ScheduleRequest(AlgorithmName.SIMULATED_ANNEALING, null, null);
        // Set the required fields in ScheduleRequest object

        doThrow(new UnsupportedOperationException("Error creating algorithm parameters")).when(algorithmService).startAlgorithm(any(ScheduleRequest.class), anyString());

        mockMvc.perform(MockMvcRequestBuilders.post("/start_scheduling")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(MockMvcResultMatchers.status().isInternalServerError())
                .andExpect(MockMvcResultMatchers.content().string("Error creating algorithm parameters"));

        verify(algorithmService, Mockito.times(1)).startAlgorithm(any(ScheduleRequest.class), anyString());
    }

    @Test
    void shouldThrowException() throws Exception {
        ScheduleRequest request = new ScheduleRequest(AlgorithmName.SIMULATED_ANNEALING, null, null);

        doThrow(new RuntimeException("Unexpected error")).when(algorithmService).startAlgorithm(any(ScheduleRequest.class), anyString());

        mockMvc.perform(MockMvcRequestBuilders.post("/start_scheduling")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(MockMvcResultMatchers.status().isInternalServerError())
                .andExpect(MockMvcResultMatchers.content().string("Error starting algorithm"));

        verify(algorithmService, Mockito.times(1)).startAlgorithm(any(ScheduleRequest.class), anyString());
    }
}
