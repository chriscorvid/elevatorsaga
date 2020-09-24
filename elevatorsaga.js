{
  init: function(elevators, floors) {
      let door = 0;
      
      floors.forEach((floor) => {
          floor.on('up_button_pressed down_button_pressed', () => {
              elevator = elevators[door++%elevators.length];
              if (!elevator.getPressedFloors().includes(floor.floorNum()) && elevator.loadFactor() < 0.4) {
                  elevator.goToFloor(floor.floorNum());
              }
          });
      });
      
      elevators.forEach((elevator) => {
          elevator.on('floor_button_pressed', (floorNum) => {
              elevator.goToFloor(floorNum);
          });

          elevator.on("stopped_at_floor", (floorNum) => {
              let pressedFloors = elevator.getPressedFloors();
              if (pressedFloors.length === 0) {
                  elevator.goToFloor(0, true);
              } else {
                  if (elevator.goingDownIndicator()) {
                      elevator.goToFloor(pressedFloors[0], true);
                  } else {
                      elevator.goToFloor(pressedFloors[pressedFloors.length - 1], true);
                  }
              }
          });
          
          elevator.on('passing_floor', (floorNum, direction) => {
              if (elevator.getPressedFloors().includes(floorNum) && direction == elevator.destinationDirection() && elevator.loadFactor() < 0.6) {
                  elevator.goToFloor(floorNum, true);
              }
          });
      });
  },
  update: function(dt, elevators, floors) {
     // We normally don't need to do anything here
  }
}
