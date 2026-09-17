package com.training.test.controller;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import com.training.service.VendorService;

@SpringBootTest
@AutoConfigureMockMvc
public class VendorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private VendorService vendorServiceMock;

    @Test
    public void indexVendorControllerTest() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders.get("/"))
               .andExpect(status().isOk())
               .andExpect(content().string("Welcome to Spring Boot Vendor Service API!"));
    }
}