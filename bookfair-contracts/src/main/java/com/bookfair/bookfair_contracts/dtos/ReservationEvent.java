package main.java.com.bookfair.bookfair_contracts.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationEvent {
    public String message;
    public String status;
    public Reservation reservation;
}
