import React from 'react';
import { ResumeRecord } from '../../types/resume';
import { ResumeThemeWrapper } from './ResumeThemeWrapper';
import { ResumeHeaderRenderer } from './ResumeHeaderRenderer';
import { ResumeBodyRenderer } from './ResumeBodyRenderer';

interface TemplateProps {
  resume: ResumeRecord;
}

export const ExecutiveMinimalistTemplate: React.FC<TemplateProps> = ({ resume }) => {
  return (
    <ResumeThemeWrapper resume={resume} defaultFontFamily="font-serif">
      <ResumeHeaderRenderer resume={resume} isSerif />
      <ResumeBodyRenderer 
        resume={resume} 
        headingStyleOverride={resume.content.style.sectionHeadingStyle || 'overline_underline'} 
      />
    </ResumeThemeWrapper>
  );
};
