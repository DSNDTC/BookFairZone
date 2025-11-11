package com.bookfair.user_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 1. Define the Security Filter Chain (Authorizes access to endpoints)
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF for POST/PUT/DELETE requests in a stateless API like this
            .csrf(csrf -> csrf.disable())

            // Configure request authorization
            .authorizeHttpRequests(auth -> auth
                // Allow /api/health to be publicly accessible
                .requestMatchers("/api/health").permitAll()
                
                // Require authentication for ALL other paths
                .anyRequest().authenticated()
            )

            // Enable HTTP Basic authentication for the secured paths
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    // 2. Define the In-Memory User (Reads credentials from application.properties)
    // NOTE: This overrides the simple properties, but ensures the user is defined correctly.
    @Bean
    public InMemoryUserDetailsManager userDetailsService() {
        UserDetails user = User.withDefaultPasswordEncoder()
            .username("admin")
            .password("admin")
            .roles("USER") // Assign a role
            .build();
        return new InMemoryUserDetailsManager(user);
    }
}