//package com.bookfair.user_service.service;
//
//import com.bookfair.user_service.repository.StallRepository;
//import com.bookfair.user_service.model.dto.Stall;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Optional;
//
//@Service
//public class StallService {
//
//    private final StallRepository stallRepository;
//
//    @Autowired
//    public StallService(StallRepository stallRepository) {
//        this.stallRepository = stallRepository;
//    }
//
//    // Create
//    public Stall addStall(Stall stall) {
//        return stallRepository.save(stall);
//    }
//
//    // Read
//    public List<Stall> getAllStalls() {
//        return stallRepository.findAll();
//    }
//
//    // Read by ID
//    public Optional<Stall> getStallById(Long id) {
//        return stallRepository.findById(id);
//    }
//
//    // Update
//    public Stall updateStall(Long id, Stall stallDetails) {
//        return stallRepository.findById(id).map(stall -> {
//            stall.setName(stallDetails.getName());
//            stall.setSize(stallDetails.getSize());
//            stall.setPrice(stallDetails.getPrice());
//
//            // update reservation status only if explicitly provided
//            if (stallDetails.isReserved() != stall.isReserved()) {
//                 stall.setReserved(stallDetails.isReserved());
//            }
//            return stallRepository.save(stall);
//        }).orElse(null);
//
//    }
//
//    // Delete
//    public boolean deleteStall(Long id) {
//        if (stallRepository.existsById(id)) {
//            stallRepository.deleteById(id);
//            return true;
//        }
//        return false;
//    }
//}