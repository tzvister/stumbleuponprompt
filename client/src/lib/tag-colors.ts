export const getTagColor = (tag: string): string => {
  // Creative and writing tags - Orange/Red
  if (tag.toLowerCase().includes('creative') || 
      tag.toLowerCase().includes('writing') || 
      tag.toLowerCase().includes('content') ||
      tag.toLowerCase().includes('copywriting') ||
      tag.toLowerCase().includes('marketing')) {
    return 'bg-orange-100 text-orange-800';
  }
  
  // Technical and art tags - Teal/Blue  
  if (tag.toLowerCase().includes('art') || 
      tag.toLowerCase().includes('midjourney') ||
      tag.toLowerCase().includes('technical') ||
      tag.toLowerCase().includes('code') ||
      tag.toLowerCase().includes('analysis') ||
      tag.toLowerCase().includes('research')) {
    return 'bg-teal-100 text-teal-800';
  }
  
  // Productivity and music tags - Yellow/Amber
  if (tag.toLowerCase().includes('music') || 
      tag.toLowerCase().includes('productivity') ||
      tag.toLowerCase().includes('business') ||
      tag.toLowerCase().includes('strategy') ||
      tag.toLowerCase().includes('education')) {
    return 'bg-amber-100 text-amber-800';
  }
  
  // Default - Neutral gray
  return 'bg-gray-100 text-gray-800';
};