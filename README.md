# Afterlife_xhud (Modified & Styled)  

**Note:** This project is a modified version of **AfterLifeStudio’s Afterlife_xhud**, part of their [Afterlife-Resources](https://github.com/AfterLifeStudio/Afterlife-Resources).  
I’ve reworked the visuals, added color theming, redesigned the player info display, and introduced **QB-Core notification support** for hunger, thirst, and fuel levels.  

---

## ✨ Features

My modifications introduce:

- 🎨 **Refreshed color scheme** for the HUD  
- 👤 **Refreshed colour for player info panel** (health, armor, hunger, thirst, stress, etc.)  
- 🔔 **Notifications** (QB-Core integrated):  
  - Warns players when **thirst is low**  
  - Warns players when **hunger is low**  
  - Warns players when **vehicle fuel is low**  
- ⚡ Cleaner layout & spacing for less clutter  
- 🎬 Smooth UI transitions / animations  

New Features I recently introduced

- Notification Export to match your hud with
- Progressbar Export to also match your hud with

---

## 📸 Screenshots / Demo

Example:  
![HUD Screenshot](https://themba.tech/wp-content/uploads/2025/10/Screenshot-2025-10-02-030853.png)  
*Colored HUD with player info & notification support.*

---

## ⚙️ Installation

1. Clone or download this repository:  
   ```bash
   git clone https://github.com/Afterlife/Afterlife_xhud.git
   ```

2. Copy the `afterlife_xhud` resource folder into your server’s `resources` directory.

3. Ensure the resource starts in `server.cfg`:  
   ```cfg
   ensure afterlife_xhud
   ```

4. Restart or reload your server.  

---

## 🔧 Configuration

Inside the resource config, you can set:

- `themeColor` — base HUD color  
- Enable / disable **player info elements** (hunger, thirst, stress, armor, etc.)  
- **Notification thresholds** (e.g. warn if hunger < 20%)  
- HUD position offsets  

For further visual tweaks, edit the CSS in the `ui/` or `html/` folder.

---

## 🎨 Customization / Theming

- Change HUD colors with HEX/RGB values  
- Add / remove panels (e.g. hunger & thirst if not used on your server)  
- Replace icons or fonts for your own style  
- Adjust notification messages for your community’s tone  

---

## 🙌 Credits

- **Original resource**: [AfterLifeStudio / Afterlife-Resources](https://github.com/AfterLifeStudio/Afterlife-Resources)  
- **Modifications (HUD styling, notifications, redesign)**: by sgMAGLERA/ME  

*(Please respect the license of the original repository — attribution required.)*  

---

## 📜 Changelog

| Version | Date       | Changes |
|---------|------------|---------|
| 1.0.0   | 2025-10-02 | Initial modified release with color theming & redesigned player info |
| 1.1.0   | 2025-10-02 | Added QB-Core notifications for hunger, thirst & fuel |
| 2.0.0   | 2025-10-07 | Added built-in Notifications export and also a Progressbar Export to help have a unified server look

---

For the original HUD, check out **AfterLifeStudio’s repo**:  
👉 [https://github.com/AfterLifeStudio/Afterlife-Resources](https://github.com/AfterLifeStudio/Afterlife-Resources)  

---

## 📦 Exports

This resource provides built-in exports for notifications and progress bars. They are QBCore-compatible and include advanced variants — full details are available in `EXPORTS.md` (included in this repo). Below is a concise summary and quick examples to get started.

### QBCore-compatible (drop-in)

Use these as replacements for common QBCore functions:

```lua
-- Simple notification (QBCore compatible)
exports['Afterlife_xhud']:Notify('You have successfully completed the mission!', 'success', 5000, 'check_circle')

-- Simple progressbar (QBCore compatible)
exports['Afterlife_xhud']:Progressbar('healing_' .. GetPlayerServerId(PlayerId()), 'Healing', 5000, false, true)
```

### Advanced exports (examples)

Show a detailed notification with title/description:

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

Start a full-featured progress bar (cancelable, with callbacks):

```lua
local progressId = 'task_' .. GetGameTimer()
exports['Afterlife_xhud']:ShowProgressBar({
   id = progressId,
   type = 'info',
   title = 'Processing',
   description = 'Please wait...',
   progress = 0,
   duration = 5000,
   cancellable = true
})

-- Optional: Update programmatically
exports['Afterlife_xhud']:UpdateProgressBar(progressId, 50, '50% Complete')
```

For the complete list of exports, parameters, and test commands (e.g. `/testnotification`, `/testprogressbar`), see `EXPORTS.md` in this repository.

