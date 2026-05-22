import { useState } from 'react';
import { motion } from 'motion/react';
import { LayoutGrid } from 'lucide-react';
import BoardService from '../../services/BoardService';
import { PageBackground } from '../../components/PageBackground';
import { BrandBadge } from '../../components/BrandBadge';
import { FormInput } from '../../components/FormInput';
import { FormTextarea } from '../../components/FormTextarea';
import { PrimaryButton } from '../../components/PrimaryButton';
import toast from 'react-hot-toast';

export function CreateBoard() {
  const [boardName, setBoardName] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Validation
    const newErrors: { name?: string; description?: string } = {};

    if (!boardName.trim()) {
      newErrors.name = 'Board name is required';
    }

    if (!boardDescription.trim()) {
      newErrors.description = 'Board description is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors
    setErrors({});

    try {
      // TODO: Change orgId and createdBy when create organisation page is created and hooked with api
      await BoardService.createBoard({
        orgId: 2,
        boardName: boardName,
        boardDesc: boardDescription,
        createdBy: 'f9dbfe85-7f75-41d8-8c77-0d0dde8010c0'
      });
      
      toast.success('Board created successfully!');
      
      // Clear form on success
      setBoardName('');
      setBoardDescription('');
    } catch (error) {
      console.error('Failed to create board:', error);
      toast.error("Board couldn't be created. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-8 relative overflow-hidden"
      style={{
        fontFamily: 'Inter, sans-serif',
        background: '#F6F7FB'
      }}
    >
      {/* Subtle Background Branding */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <PageBackground />

        {/* Tarakki Watermark */}
        <div
          className="absolute bottom-8 right-8 text-[120px] font-bold opacity-[0.02] select-none"
          style={{
            fontFamily: 'Inter, sans-serif',
            color: '#0073EA',
            letterSpacing: '-0.05em'
          }}
        >
          TARAKKI
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[640px] bg-white rounded-xl p-8 shadow-[0px_8px_24px_rgba(0,0,0,0.06)] relative z-10"
      >
        {/* Tarakki Brand Header */}
        <BrandBadge />

        {/* Icon with Brand Accent */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0073EA] to-[#0062C9] flex items-center justify-center shadow-lg">
              <LayoutGrid className="w-8 h-8 text-white" />
            </div>
          </motion.div>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-[28px] font-semibold text-gray-900 mb-2">
            Create Board
          </h1>
          <p className="text-[14px] text-[#6B7280]">
            Set up a new board to manage your work efficiently
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Board Name Input */}
          <FormInput
            id="boardName"
            label="Board Name"
            type="text"
            value={boardName}
            onChange={(e) => {
              setBoardName(e.target.value);
              if (errors.name) {
                setErrors({ ...errors, name: undefined });
              }
            }}
            placeholder="Enter board name"
            maxLength={100}
            showCount
            error={errors.name}
          />

          {/* Board Description Textarea */}
          <FormTextarea
            id="boardDescription"
            label="Board Description"
            value={boardDescription}
            onChange={(e) => {
              setBoardDescription(e.target.value);
              if (errors.description) {
                setErrors({ ...errors, description: undefined });
              }
            }}
            placeholder="Describe what this board is for"
            rows={4}
            maxLength={500}
            showCount
            autoResize
            error={errors.description}
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <PrimaryButton type="submit">
              Create Board
            </PrimaryButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
