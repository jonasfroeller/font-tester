import { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useFonts } from '@/hooks/useFonts';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getContrastRatio, getWCAGLevel } from '@/utils/wcagContrast';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

type TextAlign = 'left' | 'center' | 'right' | 'justify';

const useDebounceValue = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

interface FontPreviewProps {
  fontFamily: string;
  backgroundColor: string;
  textColor: string;
  letterSpacing: number;
  lineHeight: number;
  textAlign: TextAlign;
}

const FontPreview = memo(({ 
  fontFamily, 
  backgroundColor, 
  textColor, 
  letterSpacing, 
  lineHeight,
  textAlign 
}: FontPreviewProps) => {
  return (
    <div 
      style={{ 
        fontFamily: `"${fontFamily}", sans-serif`,
        backgroundColor,
        color: textColor,
        letterSpacing: `${letterSpacing}em`,
        lineHeight,
        textAlign,
      }} 
      className="p-4 rounded-md"
    >
      <div className="mb-8 pb-4 border-b">
        <h1 className={`text-6xl font-bold mb-4`}>Heading 1</h1>
        <p>Font size: 3.75rem (60px)</p>
      </div>

      <div className="mb-8 pb-4 border-b">
        <h2 className={`text-5xl font-bold mb-4`}>Heading 2</h2>
        <p>Font size: 3rem (48px)</p>
      </div>

      <div className="mb-8 pb-4 border-b">
        <h3 className={`text-4xl font-bold mb-4`}>Heading 3</h3>
        <p>Font size: 2.25rem (36px)</p>
      </div>

      <div className="mb-8 pb-4 border-b">
        <h4 className={`text-3xl font-bold mb-4`}>Heading 4</h4>
        <p>Font size: 1.875rem (30px)</p>
      </div>

      <div className="mb-8 pb-4 border-b">
        <h5 className={`text-2xl font-bold mb-4`}>Heading 5</h5>
        <p>Font size: 1.5rem (24px)</p>
      </div>

      <div className="mb-8 pb-4 border-b">
        <h6 className={`text-xl font-bold mb-4`}>Heading 6</h6>
        <p>Font size: 1.25rem (20px)</p>
      </div>

      <div className="mb-8 pb-4 border-b">
        <h5 className="text-xl font-bold mb-4">Paragraph Example</h5>
        <p className="mb-4">
          This is a sample paragraph to demonstrate text alignment options. 
          Notice how different alignments affect the flow and readability of text.
          The justified alignment creates straight edges on both the left and right sides.
        </p>
        <p>
          Typography is the art and technique of arranging type to make written language 
          legible, readable, and appealing when displayed. The arrangement of type involves 
          selecting typefaces, point sizes, line lengths, line spacing, and letter spacing, 
          as well as adjusting the space between pairs of letters.
        </p>
      </div>
    </div>
  );
});
FontPreview.displayName = 'FontPreview';

interface ContrastInfoProps {
  contrastRatio: number;
  wcagLevels: {
    normalText: string;
    largeText: string;
    graphicElements: string;
  };
}

const ContrastInfo = memo(({ contrastRatio, wcagLevels }: ContrastInfoProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">WCAG 2.1 Contrast Ratio: {contrastRatio.toFixed(2)}:1</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="font-medium">Normal Text</div>
          <div className="text-sm text-gray-600 mb-2">
            Text size ≤ 17pt (22.6px)
          </div>
          <div className={`text-sm ${wcagLevels.normalText === 'Fail' ? 'text-red-500' : 'text-green-500'}`}>
            {wcagLevels.normalText}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="font-medium">Large Text</div>
          <div className="text-sm text-gray-600 mb-2">
            Text size ≥ 18pt (24px) or<br />
            Bold text ≥ 14pt (18.6px)
          </div>
          <div className={`text-sm ${wcagLevels.largeText === 'Fail' ? 'text-red-500' : 'text-green-500'}`}>
            {wcagLevels.largeText}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="font-medium">Graphic Elements</div>
          <div className="text-sm text-gray-600 mb-2">
            UI components, icons, and<br />
            meaningful graphics
          </div>
          <div className={`text-sm ${wcagLevels.graphicElements === 'Fail' ? 'text-red-500' : 'text-green-500'}`}>
            {wcagLevels.graphicElements}
          </div>
        </div>
      </div>
    </Card>
  );
});
ContrastInfo.displayName = 'ContrastInfo';

const ColorPicker = memo(({ 
  label, 
  color, 
  onChange, 
  id 
}: { 
  label: string; 
  color: string; 
  onChange: (value: string) => void; 
  id: string 
}) => {
  const [localColor, setLocalColor] = useState(color);
  
  const handleLocalChange = (value: string) => {
    setLocalColor(value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localColor !== color) {
        onChange(localColor);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [localColor, onChange, color]);

  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-2">
        <Input
          id={id}
          type="color"
          value={localColor}
          onChange={(e) => handleLocalChange(e.target.value)}
          className="w-16 h-10 p-1"
        />
        <Input 
          value={localColor.toUpperCase()} 
          onChange={(e) => handleLocalChange(e.target.value)}
          className="font-mono"
        />
      </div>
    </div>
  );
});
ColorPicker.displayName = 'ColorPicker';

const SliderControl = memo(({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step, 
  id,
  formatValue,
  unit = ""
}: { 
  label: string; 
  value: number; 
  onChange: (value: number[]) => void; 
  min: number; 
  max: number; 
  step: number; 
  id: string;
  formatValue?: (value: number) => string;
  unit?: string;
}) => {
  // Internal state for real-time UI feedback
  const [localValue, setLocalValue] = useState<number[]>([value]);
  
  // Format the display value
  const displayValue = formatValue 
    ? formatValue(localValue[0]) 
    : localValue[0].toFixed(step < 0.1 ? 2 : 1);
  
  // Update parent value after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue[0] !== value) {
        onChange(localValue);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  // Sync with parent value when it changes externally
  useEffect(() => {
    setLocalValue([value]);
  }, [value]);

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-4">
        <Slider
          id={id}
          value={localValue}
          onValueChange={setLocalValue}
          min={min}
          max={max}
          step={step}
          className="flex-1"
        />
        <span className="w-12 text-sm font-mono">{displayValue}{unit}</span>
      </div>
    </div>
  );
});
SliderControl.displayName = 'SliderControl';

const useOutsideClick = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
};

const FontTester = () => {
  const { data: fontsData, isLoading } = useFonts();
  const [selectedFont, setSelectedFont] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // State for immediate UI feedback (internal state)
  const [textColor, setTextColor] = useState("#FFC745");
  const [backgroundColor, setBackgroundColor] = useState("#007A78");
  const [letterSpacing, setLetterSpacing] = useState([0]);
  const [lineHeight, setLineHeight] = useState([1.5]);
  const [textAlign, setTextAlign] = useState<TextAlign>('left');
  
  // Handle closing the dropdown when clicking outside
  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);
  
  const dropdownRef = useOutsideClick(closeDropdown);
  
  // Handle font selection
  const handleSelectFont = useCallback((font: string) => {
    setSelectedFont(font);
    setIsDropdownOpen(false);
  }, []);
  
  // Toggle dropdown
  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);
  
  // Clear search when dropdown closes
  useEffect(() => {
    if (!isDropdownOpen) {
      setSearchQuery("");
    }
  }, [isDropdownOpen]);
  
  const { toast } = useToast();

  useEffect(() => {
    if (!selectedFont && fontsData?.items.length > 0) {
      setSelectedFont(fontsData.items[0].family);
    }
  }, [fontsData, selectedFont]);

  useEffect(() => {
    if (!selectedFont) return;

    const link = document.createElement('link');
    link.href = `https://api.fonts.coollabs.io/css2?family=${selectedFont.replace(' ', '+')}:wght@400;700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [selectedFont]);

  const handleCopy = useCallback((text) => {
    navigator.clipboard.writeText(text);
    toast({
      description: "Copied to clipboard!",
    });
  }, [toast]);

  const filteredFonts = useMemo(() => {
    return fontsData?.items.filter(font => 
      font.family.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
  }, [fontsData, searchQuery]);

  const contrastRatio = useMemo(() => {
    return getContrastRatio(textColor, backgroundColor);
  }, [textColor, backgroundColor]);
  
  const wcagLevels = useMemo(() => {
    return getWCAGLevel(contrastRatio);
  }, [contrastRatio]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className='flex flex-wrap'>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Font Tester</h2>

          <Card className="p-6 mb-8 prose dark:prose-invert max-w-none">
            <h3 className="text-lg font-semibold mb-2">About fonts.coollabs.io</h3>
            <p className="text-sm text-gray-600">
              There have been several GDPR issues popping up lately with Google & Google CDN. 
              We don't know what they are doing with user details, such as IP address, browser agent, etc.
              So fonts.coollabs.io was created as a similar service just without logging ANYTHING.
            </p>
          </Card>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative" ref={dropdownRef}>
                {/* Custom Font Selector */}
                <div className="mb-2">
                  <Label htmlFor="fontSearch">Font Family</Label>
                </div>
                
                {/* Search Input Always Visible */}
                <div className="relative mb-2">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    id="fontSearch"
                    placeholder="Search fonts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-2 h-[50px]"
                    autoComplete="off"
                  />
                </div>
                
                {/* Selected Font Button */}
                <Button 
                  variant="outline" 
                  className="w-full justify-between h-[50px] font-normal"
                  onClick={toggleDropdown}
                >
                  <span className="font-bold">{selectedFont || "Select a font"}</span>
                  {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Button>
                
                {/* Dropdown */}
                {isDropdownOpen && (
                  <Card className="absolute mt-1 w-full z-50 shadow-lg">
                    {filteredFonts.length > 0 ? (
                      <ScrollArea className="h-[300px]">
                        <div className="p-2">
                          {filteredFonts.map((font) => (
                            <div key={font.family} className="mb-2">
                              <Button
                                variant="ghost"
                                className={`w-full h-auto justify-start text-left !py-4 ${selectedFont === font.family ? 'bg-muted' : ''}`}
                                onClick={() => handleSelectFont(font.family)}
                                style={{ padding: '16px 12px' }}
                              >
                                <div className="flex flex-col gap-1 max-w-full">
                                  <div className="font-semibold text-base truncate max-w-full">{font.family}</div>
                                  <div className="text-xs text-gray-500 break-all max-w-full">
                                    {font.variants.length} weights • {font.subsets.slice(0, 3).join(', ')}{font.subsets.length > 5 ? '...' : ''} • {font.category}
                                  </div>
                                </div>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="p-4 text-center text-gray-500">No fonts found</div>
                    )}
                  </Card>
                )}
              </div>

              <div className="w-[180px]">
                <div className="mb-2">
                  <Label htmlFor="textAlign">Text Alignment</Label>
                </div>
                <Select
                  value={textAlign}
                  onValueChange={(value: TextAlign) => setTextAlign(value)}
                >
                  <SelectTrigger id="textAlign" className="w-full h-[50px] px-4 py-3">
                    <SelectValue placeholder="Text Alignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="justify">Justify</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <ColorPicker 
                id="textColor"
                label="Text Color"
                color={textColor}
                onChange={setTextColor}
              />
              
              <ColorPicker 
                id="bgColor"
                label="Background Color"
                color={backgroundColor}
                onChange={setBackgroundColor}
              />

              <SliderControl
                id="letterSpacing"
                label="Letter Spacing (em)"
                value={letterSpacing[0]}
                onChange={setLetterSpacing}
                min={-0.1}
                max={0.5}
                step={0.01}
                unit="em"
              />
              
              <SliderControl
                id="lineHeight"
                label="Line Height"
                value={lineHeight[0]}
                onChange={setLineHeight}
                min={1}
                max={2.5}
                step={0.1}
              />
            </div>

            <ContrastInfo contrastRatio={contrastRatio} wcagLevels={wcagLevels} />
          </div>
        </div>

        {selectedFont && (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Font Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Category</div>
                <div className="mt-1">
                  {fontsData?.items.find(font => font.family === selectedFont)?.category || 'Unknown'}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Available weights</div>
                <div className="mt-1">
                  {fontsData?.items.find(font => font.family === selectedFont)?.variants.join(', ') || 'Unknown'}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Subsets</div>
                <div className="mt-1">
                  {fontsData?.items.find(font => font.family === selectedFont)?.subsets.join(', ') || 'Unknown'}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Last modified</div>
                <div className="mt-1">
                  {fontsData?.items.find(font => font.family === selectedFont)?.lastModified || 'Unknown'}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-6 space-y-8">
          <FontPreview 
            fontFamily={selectedFont}
            backgroundColor={backgroundColor}
            textColor={textColor}
            letterSpacing={letterSpacing[0]}
            lineHeight={lineHeight[0]}
            textAlign={textAlign}
          />
        </Card>

        <Card className="p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">Font Import Formats</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">HTML Link Format</h4>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm overflow-x-auto">
                <pre>{`<link rel="preconnect" href="https://api.fonts.coollabs.io" crossorigin />
<link href="https://api.fonts.coollabs.io/css2?family=${selectedFont.replace(' ', '+')}:wght@400;700&display=swap" rel="stylesheet" />`}</pre>
                <button 
                  onClick={() => handleCopy(`<link rel="preconnect" href="https://api.fonts.coollabs.io" crossorigin />
<link href="https://api.fonts.coollabs.io/css2?family=${selectedFont.replace(' ', '+')}:wght@400;700&display=swap" rel="stylesheet" />`)}
                  className="mt-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">CSS Import Format</h4>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm overflow-x-auto">
                <pre>{`@import url('https://api.fonts.coollabs.io/css2?family=${selectedFont.replace(' ', '+')}:wght@400;700&display=swap');`}</pre>
                <button 
                  onClick={() => handleCopy(`@import url('https://api.fonts.coollabs.io/css2?family=${selectedFont.replace(' ', '+')}:wght@400;700&display=swap');`)}
                  className="mt-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">CSS Font Family Usage</h4>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm overflow-x-auto">
                <pre>{`font-family: '${selectedFont}', sans-serif;`}</pre>
                <button 
                  onClick={() => handleCopy(`font-family: '${selectedFont}', sans-serif;`)}
                  className="mt-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default FontTester;
