
import { useQuery } from '@tanstack/react-query';
import { FontsResponse } from '@/types/fonts';

const FONTS_URL = 'https://gist.githubusercontent.com/jonasfroeller/e466eefd7e359b0b9afaae0325fa633f/raw/0d544d28d680ff20df8a492b477c152ead0be149/webfonts.json';

export const useFonts = () => {
  return useQuery({
    queryKey: ['fonts'],
    queryFn: async (): Promise<FontsResponse> => {
      const response = await fetch(FONTS_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch fonts');
      }
      return response.json();
    }
  });
};
