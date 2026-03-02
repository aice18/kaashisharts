

import { ClassLevel, SyllabusItem, GalleryItem } from "./types";

export const GALLERY_IMAGES: GalleryItem[] = [
  { url: "../../assets/show1.png", title: "Pikachu", date: "2024-01-15" },
  { url: "../../assets/show2.png", title: "Vincent Van Gogh", date: "2024-02-20" },
  { url: "../../assets/show3.png", title: "Himalayas", date: "2024-03-10" },
  { url: "../../assets/child1.jpeg", title: "Sweet Tooth", date: "2024-04-05" },
  { url: "../../assets/child2.jpeg", title: "Prism Feather", date: "2024-05-12" },
  { url: "../../assets/child3.jpeg", title: "After Hours", date: "2024-06-18" }
];

export const TESTIMONIALS = [
  { name: "Priya M.", text: "KashArts has transformed my daughter's confidence. She loves the creative freedom!", role: "Parent" },
  { name: "Rahul D.", text: "The structured syllabus really helps track progress. The daily logs are a game changer.", role: "Parent" },
];

export const SYLLABUS_DATA: SyllabusItem[] = [
  {
    level: ClassLevel.One,
    title: "Foundations of Fun",
    description: "Introduction to holding brushes, primary colors, and basic shapes.",
    modules: ["Grip Techniques", "Circle, Square, Triangle", "Primary Colors (Red, Blue, Yellow)", "Finger Painting"]
  },
  {
    level: ClassLevel.Two,
    title: "World of Lines",
    description: "Exploring line weights, patterns, and basic object drawing.",
    modules: ["Straight vs Curved", "Pattern Making", "Drawing Fruits", "Color Mixing (Secondary Colors)"]
  },
  {
    level: ClassLevel.Three,
    title: "Nature & Observations",
    description: "Looking at nature, drawing leaves, flowers, and simple landscapes.",
    modules: ["Leaf Anatomy", "Flower Petals", "Simple Trees", "Introduction to Watercolors"]
  },
  {
    level: ClassLevel.Four,
    title: "Animals & Animation",
    description: "Basic anatomy of animals and creating simple characters.",
    modules: ["Stick Figures in Action", "Animal Faces", "Cartoon Basics", "Pastel Shades"]
  },
  {
    level: ClassLevel.Five,
    title: "Perspective & Depth",
    description: "Understanding near vs far, 1-point perspective.",
    modules: ["1-Point Perspective", "Shadows and Light", "Cityscapes", "Oil Pastels Blending"]
  },
  {
    level: ClassLevel.Six,
    title: "Portraits & Expressions",
    description: "Human face proportions and emotional expression.",
    modules: ["Face Proportions", "Eye and Nose Detail", "Expressions", "Acrylic Basics"]
  },
  {
    level: ClassLevel.Seven,
    title: "Masterpiece & Reflection",
    description: "Complex compositions, sharing 7-year experiences, and planning the next artistic journey.",
    modules: ["Advanced Composition", "Canvas Painting", "Experience Sharing Session", "Future Roadmap & New Sessions"]
  }
];