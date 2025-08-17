# StumbleUponPrompt Release Notes

## Version 0.1.1 - August 17, 2025

### 🎉 Major Features

#### 🤖 Grok Integration
- Added Grok as the fourth AI platform alongside ChatGPT, Claude, and Gemini
- One-click prompt sharing to Grok using `grok.com/?q=` URL format
- Full variable substitution support for personalized prompts
- Updated button layout to accommodate all four AI platforms

#### ✨ Enhanced Variable Experience
- **Smooth Fade-in Animations**: Variable descriptions now appear with elegant fade-in effects when users start typing
- **Improved Input Flow**: Original variable explanations remain in placeholder text for immediate context
- **Progressive Disclosure**: Hint text appears only when needed, reducing visual clutter
- **Stable Layout**: Reserved space prevents layout shifts during animations

#### 📱 Mobile Optimization
- Hidden token estimation on mobile devices to maximize space for content
- Title and description now use full width on phones and tablets
- Maintained desktop functionality with token count for larger screens
- Cleaner, more focused mobile reading experience

### 🔧 Technical Improvements

#### Deep Link System
- Extended deep link utility with Grok support
- Consistent URL encoding across all platforms
- Maintained platform-specific behaviors (e.g., Gemini copy-paste mode)

#### Responsive Design
- Updated grid layout from 3 to 4 columns on desktop for AI platform buttons
- Mobile-first approach with progressive enhancement
- Consistent spacing and visual hierarchy across devices

#### User Interface Polish
- Smooth transitions with 300ms duration for professional feel
- Proper opacity and transform animations
- Enhanced visual feedback for user interactions

### 🎨 Design Updates
- **Grok Button Styling**: Black theme to match Grok's brand identity
- **Animation Consistency**: Unified transition timing across components
- **Mobile Layout**: Optimized content hierarchy for smaller screens
- **Visual Balance**: Better spacing between elements on all devices

### 💡 User Experience Enhancements
- **Reduced Cognitive Load**: Information appears when relevant
- **Faster Onboarding**: Clearer variable input process
- **Cross-Platform Support**: Seamless experience across all major AI platforms
- **Mobile-First**: Optimized for the growing mobile user base

### 🚀 Performance
- Efficient state management for animation controls
- Minimal layout recalculations with reserved space
- Optimized rendering with conditional visibility classes

---

## Previous Releases

### Version 0.1.0 - August 16, 2025
- Removed user authentication system for simplified experience
- Streamlined data model focusing on core discovery features
- Moved to static JSON-based prompt storage
- Enhanced navigation with sticky Previous/Next controls
- Redesigned horizontal filters for better mobile experience
- Fixed type safety and component issues

---

## Technical Stack
- **Frontend**: React + TypeScript + Vite
- **UI Components**: shadcn/ui + Radix UI + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Database**: In-memory storage with PostgreSQL production support
- **ORM**: Drizzle with type-safe operations

## AI Platform Integrations
- **ChatGPT**: Direct deep links with pre-filled prompts
- **Claude**: Native integration with claude.ai
- **Gemini**: Copy-paste workflow with automatic clipboard handling
- **Grok**: URL parameter pre-filling via grok.com

## Deployment
Ready for GitHub deployment with comprehensive README and production configuration.

---

*For technical details and architecture information, see `replit.md` in the project root.*