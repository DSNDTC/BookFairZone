package com.bookfair.reservation_service.config;

import com.bookfair.reservation_service.security.GatewayAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final GatewayAuthenticationFilter gatewayAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // VENDORS (USER_ROLE) create reservations
                        .requestMatchers(HttpMethod.POST, "/api/reservations").hasAuthority("USER_ROLE")
                        .requestMatchers(HttpMethod.GET, "/api/reservations/my-reservations").hasAuthority("USER_ROLE")

                        // EMPLOYEES (ADMIN_ROLE) manage reservations
                        .requestMatchers(HttpMethod.POST, "/api/reservations/{id}/confirm").hasAuthority("ADMIN_ROLE")
                        .requestMatchers(HttpMethod.POST, "/api/reservations/{id}/reject").hasAuthority("ADMIN_ROLE")
                        .requestMatchers(HttpMethod.GET, "/api/reservations").hasAuthority("ADMIN_ROLE")
                        .requestMatchers(HttpMethod.GET, "/api/reservations/user/{userId}").hasAuthority("ADMIN_ROLE")

                        .anyRequest().authenticated()
                )
                // Use gateway authentication filter to extract user from headers
                .addFilterBefore(gatewayAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}