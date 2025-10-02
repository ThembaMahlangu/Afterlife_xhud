local vehicle

-- Fuel warning system variables
local fuelWarned50 = false
local fuelWarned30 = false

SetFlyThroughWindscreenParams(15.0, 20.0, 17.0, -500.0)

---@class VehicleState
VehicleState = {
    vehspeed = 0,
    vehrpm = 0,
    vehfuel = 0,
    vehgear = 0,
    damage = 0,
    class = 0,
    mileage = 0,
    seatbelt = false
}




local speedometer = function()
    CreateThread(function()
        while vehicle do
            if GlobalSettings.mphkmh then
                VehicleState.vehspeed = math.ceil(GetEntitySpeed(vehicle) * 2.236936)
            else
                VehicleState.vehspeed = math.ceil(GetEntitySpeed(vehicle) * 3.6)
            end
            VehicleState.vehrpm = GetVehicleCurrentRpm(vehicle)
            VehicleState.vehfuel = GetFuel(vehicle)
            VehicleState.vehgear = GetVehicleCurrentGear(vehicle)
            VehicleState.damage = GetVehicleDamage(vehicle)

            -- Fuel warning system
            local fuelLevel = VehicleState.vehfuel
            if fuelLevel <= 50 and not fuelWarned50 then
                fuelWarned50 = true
                Notify("Fuel Warning", "Your fuel is running low! Find a gas station soon.", "warning")
            elseif fuelLevel > 50 then
                fuelWarned50 = false
            end

            if fuelLevel <= 30 and not fuelWarned30 then
                fuelWarned30 = true
                Notify("Low Fuel!", "Your fuel is critically low! You need to refuel immediately!", "error")
            elseif fuelLevel > 30 then
                fuelWarned30 = false
            end

            local data = {
                show = true,
                rpm = VehicleState.vehrpm,
                speed = VehicleState.vehspeed,
                fuel = VehicleState.vehfuel,
                engine = VehicleState.damage,
                seatbelt = VehicleState.seatbelt,
                gear = VehicleState.vehgear,
                class = VehicleState.class,
                mileagec = Config.mileage,
                mileage = VehicleState.mileage
            }
            NuiMessage('speedometer', data)
            Wait(Config.speedometerspeed)
        end
    end)
end

if Config.mileage then
    CreateThread(function()
        while true do
            if cache.vehicle then
                local plate = string.gsub(GetVehicleNumberPlateText(cache.vehicle), "^%s*(.-)%s*$", "%1")
                VehicleState.mileage = GetVehicleMileage(plate)
            end
            Wait(2000)
        end
    end)
end



lib.onCache('vehicle', function(vehicledata)
    vehicle = vehicledata
    local state = vehicle and true or false
    if state then
        speedometer()
    end

    NuiMessage('speedometervisible', state)
    NuiMessage('compassvisible', state)
    VehicleState.seatbelt = false

    VehicleState.class = GetVehicleClass(vehicle)

    if VehicleState.class == 8 or VehicleState.class == 13 or VehicleState.class == 14 then
        VehicleState.seatbelt = true
    end
end)

