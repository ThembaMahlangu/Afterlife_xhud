local voice








hunger = 100
thirst = 100
stress = 0
showmap = false
Voicemode = 2

-- Warning system variables
local hungerWarned50 = false
local hungerWarned30 = false
local thirstWarned50 = false
local thirstWarned30 = false




CreateThread(function()
    while true do
        local health = GetEntityHealth(cache.ped)
        local armour = GetPedArmour(cache.ped)
        local oxygen
        if not IsEntityInWater(cache.ped) then
            oxygen = 100 - GetPlayerSprintStaminaRemaining(cache.playerId)
        end
        -- Oxygen
        if IsEntityInWater(cache.ped) then
            oxygen = GetPlayerUnderwaterTimeRemaining(cache.playerId) * 10
        end

        voice = NetworkIsPlayerTalking(cache.playerId)

        -- Hunger/Thirst warning system
        if hunger <= 50 and not hungerWarned50 then
            hungerWarned50 = true
            Notify("Hunger Warning", "You're getting hungry! Find some food soon.", "warning")
        elseif hunger > 50 then
            hungerWarned50 = false
        end

        if hunger <= 30 and not hungerWarned30 then
            hungerWarned30 = true
            Notify("Starving!", "You're starving! You need to eat immediately!", "error")
        elseif hunger > 30 then
            hungerWarned30 = false
        end

        if thirst <= 50 and not thirstWarned50 then
            thirstWarned50 = true
            Notify("Thirst Warning", "You're getting thirsty! Find some water soon.", "warning")
        elseif thirst > 50 then
            thirstWarned50 = false
        end

        if thirst <= 30 and not thirstWarned30 then
            thirstWarned30 = true
            Notify("Dehydrated!", "You're dehydrated! You need to drink immediately!", "error")
        elseif thirst > 30 then
            thirstWarned30 = false
        end

        if (GlobalSettings.vehicleminimap and (cache.vehicle == false)) then
            showmap = false
        else
            showmap = true
        end



        local data = {
            status = {
                [0] = health - 100,
                [1] = armour,
                [2] = hunger,
                [3] = thirst,
                [4] = oxygen > 99 and  0 or oxygen,
                [5] = Config.stress and stress or 0,
            },

            minimap = showmap,
            voice = voice,
            voicemode = Voicemode
        }
        NuiMessage('status', data)
        Wait(500)
    end
end)





AddEventHandler('pma-voice:setTalkingMode', function(mode)
    Voicemode = mode
end)

-- QBCore Compatible Notification Export
exports('Notify', function(text, texttype, length, icon)
    local typeMap = {
        success = 'success',
        error = 'error',
        primary = 'info',
        police = 'info',
        ambulance = 'info',
        info = 'info',
        warning = 'warning'
    }
    
    NuiMessage('notificationExport', {
        type = typeMap[texttype or 'info'] or 'info',
        title = texttype or 'Info',
        description = text,
        duration = length or 5000,
        dismissible = true,
        icon = icon or (texttype == 'error' and 'error' or texttype == 'warning' and 'warning' or texttype == 'success' and 'check_circle' or 'info')
    })
end)

-- Additional exports for compatibility
exports('ShowNotification', function(data)
    NuiMessage('notificationExport', data)
end)

exports('HideNotification', function(id)
    NuiMessage('notificationHide', {id = id})
end)

exports('ShowProgressBar', function(data)
    NuiMessage('progressBarExport', data)
end)
