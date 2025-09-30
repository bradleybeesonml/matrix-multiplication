import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { AnimatorPanel } from './AnimatorPanel';
import { ControlsBar } from './ControlsBar';

export const ControlsPopover: React.FC = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Controls & Presets
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Animation</h4>
            <p className="text-sm text-muted-foreground">
              Control the visualization speed and steps.
            </p>
          </div>
          <AnimatorPanel />
          <div className="space-y-2 mt-4">
            <h4 className="font-medium leading-none">Presets</h4>
            <p className="text-sm text-muted-foreground">
              Load example matrices to get started.
            </p>
          </div>
          <ControlsBar />
        </div>
      </PopoverContent>
    </Popover>
  );
};
