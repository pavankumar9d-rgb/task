# Theming & Customization

AlarmPro uses a highly scalable CSS-Variable based theming system located natively in `frontend/public/index.html`.

## Adding a New Niche Track

To add a new genre track (e.g., "Meditation"):

1. **Update CSS Classes:**
   Add a new body class to the root stylesheet:
   ```css
   body.meditation { --accent: #bb55ff; --accent-glow: #bb55ff50; }
   ```

2. **Update Javascript Config:**
   Open the `<script>` tag and add to the `GENRES` object:
   ```javascript
   meditation: {
     label: 'Mindfulness',
     icon: '🧘',
     categories: ['Breathing', 'Yoga', 'Silence'],
     placeholder: 'e.g. Morning Routine',
     formTitle: '+ Add Session'
   }
   ```

3. **Modify the Frontend Switcher:**
   Add a new HTML option to both the Registration Form `<select>` and Settings Modal `<select>`:
   ```html
   <option value="meditation">🧘 Mindfulness</option>
   ```

## Modifying Premium Alarm Limits
To change the Free limit from 3 alarms to another number (or raise the paywall entirely), edit `backend/controllers/taskController.js`:

```javascript
// Locate this block in createTask
if (req.user.is_premium === 0 && row.count >= YOUR_NEW_LIMIT) {
  return res.status(403).json({ error: 'FREE_LIMIT_REACHED' });
}
```
