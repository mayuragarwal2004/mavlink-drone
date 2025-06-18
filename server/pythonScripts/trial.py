# from MavlinkConnection import * 

# connector = MavlinkConnector("com4", baud=57600)

# connector.process_messages()

import time
from pymavlink import mavutil

def arm_disarm_with_force(connection, arm_value, force_value):
    print(force_value)
    
    connection.mav.command_long_send(
        connection.target_system,           # target_system
        connection.target_component,        # target_component
        mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM,  # command
        0,                                 # confirmation
        arm_value,                         # param1: 0 to disarm, 1 to arm
        0,                       # param2: 0 to arm/disarm unless prevented by safety checks, or 21196 to force arming/disarming
        0, 0, 0, 0, 0, 0                    # param3 to param7 (not used)
    )
    time.sleep(5)
    connection.mav.command_long_send(
        connection.target_system,           # target_system
        connection.target_component,        # target_component
        mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM,  # command
        0,                                 # confirmation
        arm_value,                         # param1: 0 to disarm, 1 to arm
        21196,                       # param2: 0 to arm/disarm unless prevented by safety checks, or 21196 to force arming/disarming
        0, 0, 0, 0, 0, 0                    # param3 to param7 (not used)
    )

def main():
    # Connect to the autopilot using MAVLink
    connection = mavutil.mavlink_connection('com8', baud=57600)  # Replace with your connection string

    # Wait for the connection to be established
    connection.wait_heartbeat()

    print("Arming the drone with force...")

    # Arm the drone with force
    arm_disarm_with_force(connection, 1, 21196)  # 1 to arm, 21196 to force arming

    # Wait for a few seconds to allow the drone to respond
    time.sleep(5)

    # Check if the drone is armed
    if connection.messages['HEARTBEAT'].system_status == mavutil.mavlink.MAV_STATE_ACTIVE:
        print("Drone armed successfully.")
    else:
        print("Failed to arm the drone.")

    # Close the connection
    connection.close()

if __name__ == "__main__":
    main()
