# Afterlife_xhud Export Documentation

This document explains how to use the notification and progress bar exports added to the Afterlife_xhud resource. The exports are designed to be compatible with QBCore's standard format.

## QBCore Compatible Exports

### Notify (QBCore Compatible)
Displays a notification in the middle-left area of the screen using QBCore's standard format.

**Parameters:**
- `text` (string): Notification message
- `texttype` (string): 'info', 'success', 'warning', 'error', 'primary', 'police', 'ambulance' - determines color and icon
- `length` (number): Auto-hide duration in milliseconds (optional, default: 5000)
- `icon` (string): Material icon name (optional, auto-selected based on type)

**Example:**
```lua
-- QBCore compatible format
exports['Afterlife_xhud']:Notify('You have successfully completed the mission!', 'success', 5000, 'check_circle')

-- Simple usage
exports['Afterlife_xhud']:Notify('This is an info message', 'info')
```

### Progressbar (QBCore Compatible)
Displays a progress bar in the bottom-center area of the screen using QBCore's standard format.

**Parameters:**
- `name` (string): Unique identifier for the progress bar
- `label` (string): Progress bar title
- `duration` (number): Duration in milliseconds
- `useWhileDead` (boolean): Whether to show while dead (optional, default: false)
- `canCancel` (boolean): Whether the progress bar can be cancelled (optional, default: true)
- `disableControls` (table): Controls to disable (optional)
- `animation` (table): Animation settings (optional)
- `prop` (table): Prop settings (optional)
- `propTwo` (table): Second prop settings (optional)
- `onFinish` (function): Callback when completed (optional)
- `onCancel` (function): Callback when cancelled (optional)

**Example:**
```lua
-- QBCore compatible format
exports['Afterlife_xhud']:Progressbar('healing_' .. GetPlayerServerId(PlayerId()), 'Healing', 5000, false, true, nil, nil, nil, nil, function()
    print('Healing completed!')
end, function()
    print('Healing cancelled!')
end)
```

## Advanced Exports

### ShowNotification
Displays a notification with advanced options.

**Parameters:**
- `type` (string): 'info', 'success', 'warning', 'error' - determines color and icon
- `title` (string): Notification title
- `description` (string): Notification description
- `duration` (number): Auto-hide duration in milliseconds (0 = no auto-hide)
- `dismissible` (boolean): Whether the notification can be manually dismissed (default: true)
- `icon` (string): Material icon name (optional, auto-selected based on type)

**Note:** Notifications will auto-dismiss after the specified duration. No manual dismiss buttons are provided.

**Example:**
```lua
exports['Afterlife_xhud']:ShowNotification({
    type = 'success',
    title = 'Mission Complete',
    description = 'You have successfully completed the mission!',
    duration = 5000,
    dismissible = true,
    icon = 'check_circle'
})
```

### HideNotification
Manually hide a specific notification.

**Parameters:**
- `id` (string): Notification ID

## Progress Bar Export

### ShowProgressBar
Displays a progress bar in the bottom-center area of the screen.

**Parameters:**
- `id` (string): Unique identifier for the progress bar
- `type` (string): 'info', 'success', 'warning', 'error' - determines color and icon
- `title` (string): Progress bar title
- `description` (string): Progress bar description
- `progress` (number): Initial progress (0-100)
- `duration` (number): Duration in milliseconds (0 = no auto-complete)
- `cancellable` (boolean): Whether the progress bar can be cancelled (default: true)
- `icon` (string): Material icon name (optional, auto-selected based on type)

**Note:** Progress bars can be cancelled by pressing the **Esc** key. This will cancel the most recent cancellable progress bar.

**Example:**
```lua
exports['Afterlife_xhud']:ShowProgressBar({
    id = 'healing_' .. GetPlayerServerId(PlayerId()),
    type = 'info',
    title = 'Healing',
    description = 'You are being healed...',
    progress = 0,
    duration = 5000, -- 5 seconds
    cancellable = true,
    icon = 'healing'
})
```

### UpdateProgressBar
Update the progress of an existing progress bar.

**Parameters:**
- `id` (string): Progress bar ID
- `progress` (number): New progress value (0-100)
- `label` (string): Optional label to display (defaults to percentage)

**Example:**
```lua
exports['Afterlife_xhud']:UpdateProgressBar('healing_123', 50, '50% Complete')
```

### CompleteProgressBar
Mark a progress bar as complete (100% and auto-hide).

**Parameters:**
- `id` (string): Progress bar ID

### CancelProgressBar
Cancel and hide a progress bar.

**Parameters:**
- `id` (string): Progress bar ID

## Test Commands

The following test commands are available for testing the new functionality:

### QBCore Compatible Test Commands:
- `/testnotification [type]` - Test QBCore compatible notification (type: info, success, warning, error)
- `/testprogressbar` - Test QBCore compatible progress bar with automatic completion

### Advanced Test Commands:
- `/testnotifications` - Test all notification types in sequence
- `/testnotificationmultiple` - Test multiple notifications at once
- `/testprogressbars` - Test multiple progress bars with different types and settings
- `/testprogresscancel` - Test a cancellable progress bar (press Esc to cancel)
- `/testbasic` - Test both notification and progress bar with simple examples

### Utility Commands:
- `/cancelpb [id]` - Cancel progress bars (use without ID to cancel all, or with specific ID)

### Examples:
```
/testnotification success     # Test QBCore compatible notification
/testprogressbar            # Test QBCore compatible progress bar
/testnotifications          # Test all notification types
/testprogressbars           # Test multiple progress bars
/testprogresscancel        # Test cancellable progress bar
/testbasic                 # Quick test of both systems
/cancelpb                  # Cancel all progress bars
/cancelpb progress_123     # Cancel specific progress bar
```

## QBCore Integration

The Afterlife_xhud resource now provides QBCore compatible exports that can be used as drop-in replacements:

```lua
-- Instead of QBCore.Functions.Notify
exports['Afterlife_xhud']:Notify('Message', 'type', duration, icon)

-- Instead of QBCore.Functions.Progressbar  
exports['Afterlife_xhud']:Progressbar(name, label, duration, useWhileDead, canCancel, disableControls, animation, prop, propTwo, onFinish, onCancel)
```

This allows existing QBCore scripts to use the Afterlife_xhud notification and progress bar systems without modification.

## Usage Examples

### Basic Notification
```lua
-- Show a simple info notification
exports['Afterlife_xhud']:ShowNotification({
    type = 'info',
    title = 'Information',
    description = 'This is an informational message.',
    duration = 3000
})
```

### Progress Bar with Duration
```lua
local progressId = 'task_' .. GetGameTimer()

-- Start progress bar with duration
exports['Afterlife_xhud']:ShowProgressBar({
    id = progressId,
    type = 'info',
    title = 'Processing',
    description = 'Please wait...',
    progress = 0,
    duration = 5000, -- 5 seconds
    cancellable = true
})

-- Optional: Update progress manually
CreateThread(function()
    local startTime = GetGameTimer()
    while GetGameTimer() - startTime < 5000 do
        local elapsed = GetGameTimer() - startTime
        local progress = math.min(100, (elapsed / 5000) * 100)
        exports['Afterlife_xhud']:UpdateProgressBar(progressId, progress, math.floor(progress) .. '%')
        Wait(100)
    end
end)
```

### Error Notification
```lua
exports['Afterlife_xhud']:ShowNotification({
    type = 'error',
    title = 'Error',
    description = 'Something went wrong!',
    duration = 0, -- No auto-hide
    dismissible = true
})
```

## Styling

The notifications and progress bars use the same design language as the existing Info component, with:
- Gradient backgrounds
- Left border color coding based on type
- Material icons
- Smooth animations
- Responsive sizing

The components are positioned:
- **Notifications**: Top-left area (middle-left of screen)
- **Progress Bars**: Bottom-center area
