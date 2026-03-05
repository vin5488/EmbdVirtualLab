# Visteon Assessment Guide

This document contains the detailed login procedures for both candidates and administrators, as well as the complete list of the 21 exclusive C programming challenges for Visteon.

---

## 1. Access Instructions

### Candidate Login (Visteon Employees)
1. Navigate to: [VirtualLab Visteon Portal](https://virtuallab-7olf.onrender.com/?client=visteon) (or the dedicated branded link).
2. Enter your full name and your official Visteon email address (e.g., `user@visteon.com`).
3. Click "Access VirtualLab".
4. Check your email for a 6-digit OTP (One-Time Password).
5. Enter the OTP into the platform. You will be immediately directed to the "Visteon Embedded Lab" containing the 21 questions.

*Note: The platform restricts access to authorized Visteon domains and whitelisted emails. Public emails (gmail, yahoo) are blocked.*

### Administrator Login (HR / Technical Managers)
1. Navigate to the same portal.
2. In the top-right corner of the login screen, click the small "Admin" link.
3. Provide your pre-configured Admin credentials. (Please check with your platform engineer for the secure Admin password).
4. Upon secure login, you will access the Admin Dashboard where you can:
    - View all candidate submissions in real-time.
    - Review syntax, logic, and automated test scores.
    - Check for cheating violations (tab switching, copy-pasting).
    - Manage candidates in the system.

---

## 2. Visteon Challenge Curriculum (21 Problems)

The following 21 problems are specifically designed to test embedded automotive software logic in C.

### Q1: Vehicle Control Unit Simulation
**Difficulty:** Basic | **Points:** 100

**Problem Statement:**
Simulate a simple Vehicle Control Unit (VCU) that reads Speed, Engine Temperature, and Gear Position in a continuous loop. 

Logic:
1. Overspeed: If Speed > 120 km/h, print "Warning: Overspeed", else "Speed Normal".
2. Temperature: If > 110: "Critical Overheat", > 95: "High Temperature", else "Temperature Normal".
3. Gear (Switch): 0: Neutral, 1-5: First to Fifth Gear, else: "Invalid Gear".

Constraints: Use only if/else, switch, and while(1). No arrays or functions.

**Acceptance Criteria:**
- Correct use of while(1)
- Switch case for gears
- Nested if/else logic

**Test Cases:**
- **Input:** `130 98 3` -> **Expected Output:** `Warning: Overspeed\nHigh Temperature\nThird Gear`

---

### Q2: Smart Headlight Controller
**Difficulty:** Basic | **Points:** 50

**Problem Statement:**
Logic: If Light < 20: "Headlights ON", else "Headlights OFF". If HighBeam == 1: "High Beam ACTIVE". If FogLight == 1: "Fog Lights ON".

**Acceptance Criteria:**
- Simple if logic

**Test Cases:**
- **Input:** `10 1 0` -> **Expected Output:** `Headlights ON\nHigh Beam ACTIVE`

---

### Q3: Door Ajar Alarm System
**Difficulty:** Basic | **Points:** 60

**Problem Statement:**
Logic: If Door==1 and Speed > 5: "ALARM: Door Open!", else if Door==1: "Warning: Door Open", else: "Doors Secured".

**Acceptance Criteria:**
- Logical operators AND

**Test Cases:**
- **Input:** `1 20` -> **Expected Output:** `ALARM: Door Open!`

---

### Q4: Fuel Level Intelligence
**Difficulty:** Basic | **Points:** 50

**Problem Statement:**
Logic: < 10: "Critical Low", < 25: "Low Fuel", > 75: "Fuel Full", else: "Fuel Normal".

**Acceptance Criteria:**
- Multi-level if-else

**Test Cases:**
- **Input:** `5` -> **Expected Output:** `Critical Low`

---

### Q5: Adaptive Cruise Control Logic
**Difficulty:** Intermediate | **Points:** 100

**Problem Statement:**
Logic: If Distance < 20: "Braking", < 50: "Maintaining Distance", else: "Accelerating".

**Acceptance Criteria:**
- Comparison logic

**Test Cases:**
- **Input:** `15` -> **Expected Output:** `Braking`

---

### Q6: Tire Pressure Monitoring (TPMS)
**Difficulty:** Basic | **Points:** 70

**Problem Statement:**
Logic: < 25 PSI: "Low Pressure", > 45 PSI: "High Pressure", else: "Pressure OK".

**Acceptance Criteria:**
- Simple range checks

**Test Cases:**
- **Input:** `20` -> **Expected Output:** `Low Pressure`

---

### Q7: Parking Sensor Beep Logic
**Difficulty:** Basic | **Points:** 80

**Problem Statement:**
Logic: Distance < 10: "STOP", < 30: "Continuous", < 100: "Intermittent", else: "Silent".

**Acceptance Criteria:**
- Proximity logic

**Test Cases:**
- **Input:** `25` -> **Expected Output:** `Continuous`

---

### Q8: Seatbelt Reminder Module
**Difficulty:** Intermediate | **Points:** 90

**Problem Statement:**
Logic: If Present==1 and Belt==0 and Speed > 10: "LOUD ALARM", else if Present==1 and Belt==0: "Visual Warning", else: "OK".

**Acceptance Criteria:**
- Compound conditions

**Test Cases:**
- **Input:** `1 0 25` -> **Expected Output:** `LOUD ALARM`

---

### Q9: Battery Health Monitor
**Difficulty:** Intermediate | **Points:** 100

**Problem Statement:**
Logic: Voltage < 11.5: "Low Battery", > 14.8: "Overcharging", 12.6-14.4: "Healthy", else: "Normal".

**Acceptance Criteria:**
- Floating point or fixed point handling

**Test Cases:**
- **Input:** `15.2` -> **Expected Output:** `Overcharging`

---

### Q10: Rain-Sensing Wiper Control
**Difficulty:** Basic | **Points:** 50

**Problem Statement:**
Logic (Switch on Intensity): 0: "OFF", 1: "Low", 2: "Medium", 3: "High", else: "Invalid".

**Acceptance Criteria:**
- Switch-case usage

**Test Cases:**
- **Input:** `3` -> **Expected Output:** `High`

---

### Q11: Gear Shift Indicator
**Difficulty:** Intermediate | **Points:** 110

**Problem Statement:**
Logic: If RPM > 3000: "UP-SHIFT", RPM < 1500: "DOWN-SHIFT", else: "OK".

**Acceptance Criteria:**
- RPM range logic

**Test Cases:**
- **Input:** `3500` -> **Expected Output:** `UP-SHIFT`

---

### Q12: Engine Immobilizer System
**Difficulty:** Intermediate | **Points:** 80

**Problem Statement:**
Logic: If KeyID == 1234: "Engine Started", else: "Access Denied". Allow 3 attempts before clearing memory.

**Acceptance Criteria:**
- Correct ID match
- Attempt counter logic

**Test Cases:**
- **Input:** `1234` -> **Expected Output:** `Engine Started`

---

### Q13: Anti-lock Braking System (ABS) Logic
**Difficulty:** Advanced | **Points:** 120

**Problem Statement:**
Logic: If BrakeApplied == 1 and WheelSpeed < 5 and VehicleSpeed > 10: "ABS ENGAGED", else: "Normal Braking".

**Acceptance Criteria:**
- Slip detection logic

**Test Cases:**
- **Input:** `1 2 20` -> **Expected Output:** `ABS ENGAGED`

---

### Q14: Automatic Transmission Mode
**Difficulty:** Basic | **Points:** 50

**Problem Statement:**
Logic (Switch): P: "Park", R: "Reverse", N: "Neutral", D: "Drive", S: "Sport", else: "Invalid".

**Acceptance Criteria:**
- Switch case for characters

**Test Cases:**
- **Input:** `D` -> **Expected Output:** `Drive`

---

### Q15: Cooling Fan Control
**Difficulty:** Basic | **Points:** 60

**Problem Statement:**
Logic: If Temp > 100: "Fan High", > 90: "Fan Low", else: "Fan OFF".

**Acceptance Criteria:**
- Temperature thresholds

**Test Cases:**
- **Input:** `105` -> **Expected Output:** `Fan High`

---

### Q16: Electronic Stability Control (ESC)
**Difficulty:** Advanced | **Points:** 150

**Problem Statement:**
Logic: If abs(YawRate - SteeringAngle) > 10: "ESC Intervention", else: "Stable".

**Acceptance Criteria:**
- Math logic (abs equivalent)

**Test Cases:**
- **Input:** `30 5` -> **Expected Output:** `ESC Intervention`

---

### Q17: Passive Keyless Entry (PKE)
**Difficulty:** Basic | **Points:** 40

**Problem Statement:**
Logic: If SignalStrength > 70: "Doors Unlocked", < 20: "Doors Locked", else: "Wait".

**Acceptance Criteria:**
- Range checks

**Test Cases:**
- **Input:** `85` -> **Expected Output:** `Doors Unlocked`

---

### Q18: TPMS Temp Compensation
**Difficulty:** Intermediate | **Points:** 100

**Problem Statement:**
Logic: CompensatedPressure = RawPressure - (Temp - 25) * 0.1. If Compensated < 30: "Low", else "OK".

**Acceptance Criteria:**
- Arithmetic with floats

**Test Cases:**
- **Input:** `28 5` -> **Expected Output:** `Low`

---

### Q19: Power Steering Assist
**Difficulty:** Intermediate | **Points:** 90

**Problem Statement:**
Logic: If Speed < 20: "High Assist", < 60: "Medium Assist", else: "Low Assist".

**Acceptance Criteria:**
- Speed-sensitive logic

**Test Cases:**
- **Input:** `10` -> **Expected Output:** `High Assist`

---

### Q20: Traction Control System (TCS)
**Difficulty:** Advanced | **Points:** 130

**Problem Statement:**
Logic: If WheelSlip > 15: "Reduce Torque", else "Maintain Torque".

**Acceptance Criteria:**
- Slip percentage logic

**Test Cases:**
- **Input:** `20` -> **Expected Output:** `Reduce Torque`

---

### Q21: Dynamic Suspension
**Difficulty:** Intermediate | **Points:** 100

**Problem Statement:**
Logic: If Mode == 1 (Sport): "Stiff Dampers", Mode == 2 (Comfort): "Soft Dampers", else: "Normal".

**Acceptance Criteria:**
- Simple mode switch

**Test Cases:**
- **Input:** `1` -> **Expected Output:** `Stiff Dampers`

---

