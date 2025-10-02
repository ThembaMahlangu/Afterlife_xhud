
local function lerp(a, b, t) return a + (b-a) * t end

CreateThread(function()
    while true do
        local blip = GetFirstBlipInfoId(8)

        if (blip ~= 0) then
            local coord = GetBlipCoords(blip)
            local playercoord = GetEntityCoords(PlayerPedId())
            local distance = #(vec2(coord.x,coord.y) - vec2(playercoord.x,playercoord.y)) / 1000


            local onScreen, scaleX, scaleY = GetScreenCoordFromWorldCoord(coord.x, coord.y, coord.z + 5.0)
            if not onScreen then 
                onScreen, scaleX, scaleY = GetHudScreenPositionFromWorldPosition(coord.x, coord.y, coord.z + 5.0)
                scaleX = lerp(-0.1, 1.1, scaleX)
            end

            local waypoint = ((scaleX * 100) * 0.35) + 35

            NuiMessage('waypoint', waypoint)
            NuiMessage('minimapwaypoint', string.sub(tostring(distance), 1,4))
            
        else
            NuiMessage('minimapwaypoint', false)
            NuiMessage('waypoint', 0)
        end

        Wait(100)
    end
end)


CreateThread(function()
    while true do
        local sleep = Config.compassspeed
            local dgr = math.floor(-(GetGameplayCamRot(0).z - 180))
            local data = {
                heading = dgr,
                location = Location
            }
            NuiMessage('minimapcompass', data)
            NuiMessage('compass', data)
        Wait(sleep)
    end
end)
