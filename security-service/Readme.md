#  **Reservation Management System — Security Service**

#  **Overview**

This project is a microservices-based Reservation Management System designed for managing hall bookings, user registration, authentication, and notifications.
It follows a secure, modular, and scalable architecture with separate services for identity, business logic, and notifications.


## **Service Descriptions**

### Service	Description	Key Responsibilities

API Gateway	Entry point for all clients	Routes traffic to internal services, applies rate limits & request filtering
Security Service	Core authentication & identity provider	Handles email verification, login, JWT, MFA (TOTP), and role-based auth
User Service	Stores user profile & metadata	Manages user details (non-sensitive data only)
Hall Management Service	Business logic for reservations	Handles hall info, availability, bookings, and vendor interactions
Notification Service	Sends system notifications	Sends booking confirmations and system alerts (not auth emails)

###  ******Security Service — Core Identity System******

**Responsibilities**

Area	                         Description 
Authentication	               Registration, login, JWT token generation
Authorization	               Role-based access using claims in JWT
Email Verification	           Tokenized verification workflow during signup
MFA (TOTP)	                   2FA using authenticator apps (Google Authenticator, Authy)
Session Management	           Access + refresh tokens, session invalidation
Security Intelligence	       Failed login tracking, rate-limiting, anomaly detection

###  Registration Flow (Sign-Up)

 Flow Overview

`Client → API Gateway → Security Service → User Service (partial)`



* Client submits registration details: email, password, role, optional profile data.

* API Gateway routes to /auth/register in Security Service.

* Security Service performs:

* Validate email format, password strength, and role.

* Check for duplicates in security DB.

* Hash password with bcrypt or Argon2.

* Create user record:

* user_id, email, password_hash, role, account_status=UNVERIFIED, mfa_enabled=false

* Generate email verification token (JWT or UUID).

* Send verification email using SMTP ( Gmail).

* User clicks verification link:

* Gateway routes to /auth/verify-email?token=xxxx.

* Security Service validates token → activates account.

* Account status updated to ACTIVE.

* Sends event to User Service to create user profile.

* Email remains in Security Service as it’s the primary identity key for login and verification.



###  Login Flow (Authentication)
 Flow

`Client → API Gateway → Security Service`

steps

* Client sends email & password → /auth/login.

* Security Service:

* Fetch user by email.

* Verify password.

* Validate account status (UNVERIFIED → reject until verified).

* If MFA enabled, respond with MFA_REQUIRED.

* If MFA disabled, generate tokens directly.

* Return: Access Token (15 min) , Refresh Token (7 days)



Caching Layer (Redis)

Used for:

* Failed login counters
* OTP / TOTP setup storage
* JWT blacklist
* Session tracking
* Rate-limiting keys