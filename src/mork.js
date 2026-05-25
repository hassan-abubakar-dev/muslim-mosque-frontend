- Use a flex container with top alignment (items-start) and a clean gap.
- LEFT SIDE: A circular profile image (w-12 h-12, rounded-full, object-cover) that represents the mosque. Ensure it has flex-shrink-0 so it never squishes.
- RIGHT SIDE (Content Block): A flex-1 container holding three vertical rows:
  1. Top row: The Mosque Name as a title. It must be bold text (font-bold, text-gray-900) and truncated if too long.
  2. Middle row: The notification message body text below the title. Use a readable gray color (text-gray-600) and ensure words break safely if long.
  3. Bottom row: The creation timestamp date sitting below the message in small, muted text (text-xs, text-gray-400).

Additional Specs:
- The entire container should have a clean border-b, soft padding, and a smooth background transition effect on hover (hover:bg-gray-50 transition-colors).
- Accept a single 'notification' object as a prop containing: mosqueName, mosqueImage, message, and createdAt. Include a small utility helper inside the component to parse the ISO date into a localized string format.