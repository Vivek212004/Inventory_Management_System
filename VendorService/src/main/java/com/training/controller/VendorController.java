package com.training.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.training.business.bean.VendorBean;
import com.training.service.VendorServiceImpl;

@RestController
public class VendorController {

    private VendorServiceImpl vendorSerivceImpl;
    
    public VendorController(VendorServiceImpl vendorServiceImpl) {
        this.vendorSerivceImpl = vendorServiceImpl;
    }

    @GetMapping("/")
    public String index() {
        return "Welcome to Spring Boot Vendor Service API!";
    }

    @GetMapping("/vendor/controller/getVendors")
    public ResponseEntity<List<VendorBean>> getVendorDetails() {
        List<VendorBean> list = vendorSerivceImpl.getVendorDetails();
        return ResponseEntity.ok(list);
    }
}