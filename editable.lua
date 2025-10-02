PlayerLoaded = false

local prevres = {
    ratio = 1.777,
    x = 1920,
    y = 1080
}

CreateThread( function ()
    prevres.x, prevres.y = GetActiveScreenResolution()
    prevres.ratio = GetAspectRatio()
    while true do
        local x, y = GetActiveScreenResolution()
        local ratio = GetAspectRatio()

        if (not (prevres.ratio == ratio)) or (not (prevres.x == x)) or (not (prevres.y == y)) then
            prevres.x, prevres.y = GetActiveScreenResolution()
            prevres.ratio = GetAspectRatio()
            print('screen orientation updated')
            StreamMinimap()    
        end 
        Wait(1000)
    end
end)


local minimap = nil

StreamMinimap = function()

    -- local properties = {
    --     width = 0.02,
    --     height = 0.02
    -- }
    -- local defaultAspectRatio = 1920/1080 -- Don't change this.

    -- local aspectRatio = resolutionX/resolutionY
    -- local minimapOffset = 0
    -- if aspectRatio > defaultAspectRatio then
    --     minimapOffset = ((defaultAspectRatio-aspectRatio)/3.6)-0.008
    -- end



    RequestStreamedTextureDict("circlemap", false)
    while not HasStreamedTextureDictLoaded("circlemap") do
        Wait(100)
    end
    SetBlipAlpha(GetNorthRadarBlip(), 0)
    AddReplaceTexture("platform:/textures/graphics", "radarmasksm", "circlemap", "radarmasksm")


    SetMinimapComponentPosition("minimap", "L", "B", 0.005 , -0.020, 0.135, 0.23)

    -- icons within map
    SetMinimapComponentPosition("minimap_mask", "L", "B", 0.170 , 0.1, 0.06, 0.15)

    -- -0.00 = map pulled left
    -- 0.015 = map raised up
    -- 0.252 = map stretched
    -- 0.338 = map shorten
    local resolutionX, resolutionY = GetActiveScreenResolution()
    local ratio = 1.777 - resolutionX/resolutionY
    local aspectratio = 1.777 - GetAspectRatio()

    SetMinimapComponentPosition('minimap_blur', 'L', 'B', -0.025 + (aspectratio * 0.013), 0.06 - (ratio * 0.01), 0.272 - (aspectratio * 0.15), 0.37 - (ratio * 0.19))


    SetMinimapClipType(1)

    SetRadarBigmapEnabled(true, false)

    Wait(0)
    
    SetRadarBigmapEnabled(false, false)
    minimap = RequestScaleformMovie('minimap')

    SetRadarZoom(1100)
    return true

end

CreateThread( function ()
    while true do
        Wait(0)

        BeginScaleformMovieMethod(minimap, 'HIDE_SATNAV') 
        EndScaleformMovieMethod() 
    end
end)

-- CreateThread(function()
--     while true do
--         local sleep = 1000
--         if VehicleState.seatbelt then
--             sleep = 0
--             DisableControlAction(0, 75, true)
--             DisableControlAction(27, 75, true)
--         end
--         Wait(sleep)
--     end
-- end)



local doesseatbeltexist = function(vehicle)
    local class = GetVehicleClass(vehicle)
    if class ~= 8 and class ~= 13 and class ~= 14 then
        return true
    end
    return false
end

local function playBuckleSound()
    lib.requestAudioBank('audiodirectory/seatbelt_sounds')
    PlayAudio({
        audioName = VehicleState.seatbelt and 'carunbuckle' or 'carbuckle',
        audioRef = 'seatbelt_soundset',
        source = cache.ped
    })
    ReleaseNamedScriptAudioBank('audiodirectory/seatbelt_sounds')
end

local toggleseatbelt = function()
    if cache.vehicle then
        if doesseatbeltexist(cache.vehicle) then
            playBuckleSound()
            VehicleState.seatbelt = not VehicleState.seatbelt
            if VehicleState.seatbelt then
                SetFlyThroughWindscreenParams(1000.0, 1000.0, 0.0, 0.0)
            else
                SetFlyThroughWindscreenParams(15.0, 20.0, 17.0, -500.0)
            end
        end
    end
end


local TextUI = function (data)
    NuiMessage('textui', data)
end

exports('TextUI', TextUI)

XNotify =  function (data)
    PlaySoundFromEntity(-1, "BACK", cache.ped, "HUD_FRONTEND_DEFAULT_SOUNDSET", 0, 0)
    NuiMessage('notification', data)
end


DisplayHud = function(state)
    NuiMessage('visible', state)
    DisplayRadar(state)
end


exports('Notify', XNotify)



exports('DisplayHud', DisplayHud)



lib.addKeybind({
    name = 'seatbelt',
    description = 'Toggle vehicle seatbelt',
    defaultKey = Config.seatbelt,
    onPressed = function(self)
        toggleseatbelt()
    end,
})






Location = ''

CreateThread(function()
    while true do
        local PauseMenuActive = IsPauseMenuActive()

        if PauseMenuActive and not Active then
            Active = true
            NuiMessage('visible', false)
        elseif Active and not PauseMenuActive then
            Active = false
            NuiMessage('visible', true)
        end


            local ped = cache.ped
            local coords = GetEntityCoords(ped)
            local street1, street2 = GetStreetNameAtCoord(coords.x, coords.y, coords.z)
            Location = GetStreetNameFromHashKey(street1)


        Wait(1000)
    end
end)


CreateThread( function ()
    SetHudComponentSize(6, 0, 0)
    SetHudComponentSize(7, 0, 0)
    SetHudComponentSize(8, 0, 0)
    SetHudComponentSize(9, 0, 0)
end)


CreateThread(function()
    while true do
        local sleep = 500
        if (not showmap) or GlobalSettings.cinematicmode or (not GlobalSettings.showminimap) or (not (GlobalSettings.showhud)) then
            sleep = 0
            DisplayRadar(false)
        else
            DisplayRadar(true)
        end
        Wait(sleep)
    end
end)







