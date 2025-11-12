package com.bookfair.reservation_service.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GatewayUserDetails {
    private final String userId;
    private final String email;
    private final String role;
}
