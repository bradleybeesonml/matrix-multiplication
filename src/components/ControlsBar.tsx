import React from 'react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useMatrixStore } from '../store/matrixStore';
import { PRESET_MATRICES } from '../utils/matrixOperations';

interface ControlsBarProps {
  className?: string;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({ className }) => {
  const { loadPreset } = useMatrixStore();

  const handlePresetChange = (presetName: string) => {
    const preset = PRESET_MATRICES.find(p => p.name === presetName);
    if (preset) {
      loadPreset(preset);
    }
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Presets */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Quick Presets</label>
        <Select onValueChange={handlePresetChange}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select a preset..." />
          </SelectTrigger>
          <SelectContent>
            {PRESET_MATRICES.map((preset) => (
              <SelectItem key={preset.name} value={preset.name}>
                <div className="flex flex-col">
                  <span className="font-medium">{preset.name}</span>
                  <span className="text-xs text-muted-foreground">{preset.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
};