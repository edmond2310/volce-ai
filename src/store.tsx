// store.js
import { create } from 'zustand';

type ImageStore = {
  images: string[];
  setImages: (images: string[]) => void;
  videos: string[];
  setVideos: (videos: string[]) => void;
  generationType: string;
  setGenerationType: (generationType: string) => void;
  inputImage: string;
  setInputImage: (inputImage: string) => void;
};

export const useImageStore = create<ImageStore>((set) => ({
  images: [],
  setImages: (images: string[]) => set({ images }),

  videos: [],
  setVideos: (videos: string[]) => set({ videos }),

  generationType: "image",
  setGenerationType: (generationType: string) => set({ generationType }),

  inputImage: "",
  setInputImage: (inputImage: string) => set({ inputImage }),
}));
