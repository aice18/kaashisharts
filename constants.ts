
import { ClassLevel, SyllabusItem } from "./types";

export const GALLERY_IMAGES = [
  "https://picsum.photos/id/1015/800/600",
  "https://picsum.photos/id/1016/800/600",
  "https://picsum.photos/id/1018/800/600",
  "https://picsum.photos/id/1019/800/600",
  "https://picsum.photos/id/1025/800/600",
  "https://picsum.photos/id/1040/800/600",
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
    title: "Masterpiece Creation",
    description: "Complex compositions and mimicking master artists.",
    modules: ["Advanced Composition", "Study of Van Gogh", "Canvas Painting", "Final Portfolio Prep"]
  }
];
