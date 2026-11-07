import React from 'react';
import { ResumeRecord } from '../../types/resume';
import { ResumeThemeWrapper } from './ResumeThemeWrapper';
import { ResumeHeaderRenderer } from './ResumeHeaderRenderer';
import { ResumeBodyRenderer } from './ResumeBodyRenderer';

interface TemplateProps {
  resume: ResumeRecord;
}

export const ModernCleanTemplate: React.FC<TemplateProps> = ({ resume }) => {
  return (
    <ResumeThemeWrapper resume={resume} defaultFontFamily="font-sans">
      <ResumeHeaderRenderer resume={resume} />
      <ResumeBodyRenderer resume={resume} />
    </ResumeThemeWrapper>
  );
};
