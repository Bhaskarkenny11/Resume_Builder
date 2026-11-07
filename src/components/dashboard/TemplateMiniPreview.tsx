import React from 'react';
import { TemplateId } from '../../types/resume';

interface TemplateMiniPreviewProps {
  templateId: TemplateId;
}

export const TemplateMiniPreview: React.FC<TemplateMiniPreviewProps> = ({ templateId }) => {
  switch (templateId) {
    // =========================================================================
    // 1. TRADITIONAL EDITORIAL SERIF (Zero Gaps • Continuous High-Density Flow)
    // =========================================================================
    case 'traditional':
      return (
        <div className="w-full h-full bg-white text-slate-900 p-2 sm:p-2.5 text-[4.3px] sm:text-[4.8px] leading-[1.2] font-serif flex flex-col space-y-1 select-none overflow-hidden">
          {/* Header */}
          <div className="text-center pb-1 border-b border-slate-300 shrink-0">
            <h4 className="text-[8.5px] sm:text-[9.5px] font-bold tracking-wide uppercase text-slate-900">
              Tiffany Giroux
            </h4>
            <p className="text-[4.8px] text-slate-700 font-sans tracking-tight font-medium">
              Lead Freight & Supply Chain Logistics Architect • Denver, CO
            </p>
            <div className="flex items-center justify-center gap-1.5 text-[3.8px] text-slate-500 font-sans mt-0.5">
              <span>(303) 615-3967</span>
              <span>•</span>
              <span>t.giroux@logistics.com</span>
              <span>•</span>
              <span>linkedin.com/in/tgiroux</span>
              <span>•</span>
              <span>tiffany-supplychain.io</span>
            </div>
          </div>

          {/* Profile Section */}
          <div className="shrink-0">
            <div className="bg-slate-200 text-slate-800 font-bold px-1 py-0.2 uppercase tracking-wider text-[4.4px] mb-0.5">
              Executive Profile
            </div>
            <p className="text-[4.1px] text-slate-700 leading-tight">
              Resourceful Logistics Director with 9+ years optimizing intermodal freight networks, multi-terminal routing, and automated billing audits. Spearheaded cross-dock automation reducing carrier dwell time by 28% and generating $2.4M in cumulative logistics expenditure savings.
            </p>
          </div>

          {/* Work Experience Section - 4 Full Chronological Roles */}
          <div className="shrink-0 space-y-0.8">
            <div className="bg-slate-200 text-slate-800 font-bold px-1 py-0.2 uppercase tracking-wider text-[4.4px]">
              Professional Experience
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 text-[4.4px]">
                <span>Senior Freight Audit Manager • FedEx Supply Chain</span>
                <span className="font-sans text-[3.7px] text-slate-500 font-medium">Mar 2021 – Present</span>
              </div>
              <p className="text-[3.8px] text-slate-600 pl-1 leading-tight">
                ◆ Directed freight tariff audits across 22 regional terminals, eliminating $480k in annual overbillings.
              </p>
              <p className="text-[3.8px] text-slate-600 pl-1 leading-tight">
                ◆ Deployed SAP S/4HANA automated dispatch routing, lifting on-time fleet deliveries from 94.2% to 99.6%.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 text-[4.4px]">
                <span>Logistics Operations Coordinator • Ford Motor Co</span>
                <span className="font-sans text-[3.7px] text-slate-500 font-medium">Jun 2018 – Feb 2021</span>
              </div>
              <p className="text-[3.8px] text-slate-600 pl-1 leading-tight">
                ◆ Streamlined cross-dock assembly staging, cutting rail yard demurrage charges by 34% ($310k savings).
              </p>
              <p className="text-[3.8px] text-slate-600 pl-1 leading-tight">
                ◆ Supervised team of 28 dispatchers and warehouse leads handling 1,400+ daily trailer inbound movements.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 text-[4.4px]">
                <span>Intermodal Freight Specialist • Maersk Line</span>
                <span className="font-sans text-[3.7px] text-slate-500 font-medium">Aug 2016 – May 2018</span>
              </div>
              <p className="text-[3.8px] text-slate-600 pl-1 leading-tight">
                ◆ Managed customs bonded warehousing clearances for 650+ TEU per month with 100% regulatory compliance.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 text-[4.4px]">
                <span>Supply Chain Analyst • C.H. Robinson</span>
                <span className="font-sans text-[3.7px] text-slate-500 font-medium">Jun 2014 – Jul 2016</span>
              </div>
              <p className="text-[3.8px] text-slate-600 pl-1 leading-tight">
                ◆ Modeled dynamic line-haul freight spot rates, negotiating 11% average carrier rate reductions.
              </p>
            </div>
          </div>

          {/* Education Section - 2 Complete Degrees */}
          <div className="shrink-0">
            <div className="bg-slate-200 text-slate-800 font-bold px-1 py-0.2 uppercase tracking-wider text-[4.4px] mb-0.5">
              Education & Academic Honors
            </div>
            <div className="space-y-0.5">
              <div className="flex justify-between text-[4.1px] text-slate-800">
                <span className="font-bold">M.S. in Global Supply Chain & Logistics</span>
                <span className="text-slate-500 font-sans text-[3.7px]">Univ. of Denver • 2016 – 2018</span>
              </div>
              <div className="flex justify-between text-[4.1px] text-slate-800">
                <span className="font-bold">B.S. in Industrial Operations Management</span>
                <span className="text-slate-500 font-sans text-[3.7px]">Univ. of Colorado • 2010 – 2014</span>
              </div>
              <p className="text-[3.6px] text-slate-600 pl-1">Summa Cum Laude (GPA 3.94) • Alpha Pi Mu Honor Society</p>
            </div>
          </div>

          {/* Certifications Section */}
          <div className="shrink-0">
            <div className="bg-slate-200 text-slate-800 font-bold px-1 py-0.2 uppercase tracking-wider text-[4.4px] mb-0.5">
              Certifications & Industry Credentials
            </div>
            <div className="grid grid-cols-2 gap-0.8 text-[3.7px] text-slate-700">
              <div>◆ CSCP — Certified Supply Chain Professional (APICS, 2023)</div>
              <div>◆ Lean Six Sigma Black Belt (IISE, 2022)</div>
              <div>◆ SAP S/4HANA Sourcing & Procurement (SAP, 2021)</div>
              <div>◆ PMP — Project Management Professional (PMI, 2020)</div>
            </div>
          </div>

          {/* Core Competencies Matrix */}
          <div className="shrink-0">
            <div className="bg-slate-200 text-slate-800 font-bold px-1 py-0.2 uppercase tracking-wider text-[4.4px] mb-0.5">
              Core Competencies
            </div>
            <div className="grid grid-cols-4 gap-0.8 text-[3.6px] text-slate-700 font-sans">
              <span className="bg-slate-100 px-0.8 py-0.2 rounded font-medium">Tariff Auditing</span>
              <span className="bg-slate-100 px-0.8 py-0.2 rounded font-medium">Cross-Docking</span>
              <span className="bg-slate-100 px-0.8 py-0.2 rounded font-medium">TMS Architecture</span>
              <span className="bg-slate-100 px-0.8 py-0.2 rounded font-medium">Customs Brokerage</span>
              <span className="bg-slate-100 px-0.8 py-0.2 rounded font-medium">Carrier SLAs</span>
              <span className="bg-slate-100 px-0.8 py-0.2 rounded font-medium">Route Optimization</span>
              <span className="bg-slate-100 px-0.8 py-0.2 rounded font-medium">Fleet Dispatch</span>
              <span className="bg-slate-100 px-0.8 py-0.2 rounded font-medium">WMS Integration</span>
            </div>
          </div>
        </div>
      );

    // =========================================================================
    // 2. PROFESSIONAL TWO-COLUMN (Forest Sidebar + Edge-to-Edge Packed Right)
    // =========================================================================
    case 'professional':
      return (
        <div className="w-full h-full bg-white text-slate-900 flex select-none overflow-hidden font-sans">
          {/* Left Dark Forest Sidebar - Edge to edge top to bottom */}
          <div className="w-[33%] bg-[#064e3b] text-white p-1.5 sm:p-2 flex flex-col space-y-1.5 text-[4.3px]">
            <div>
              {/* Circular Headshot Avatar */}
              <div className="w-6 h-6 rounded-full bg-emerald-700 border border-emerald-400 mx-auto mb-1 flex items-center justify-center text-[7px] font-bold text-white shadow">
                SV
              </div>
              <div className="text-center font-bold text-[5.5px] leading-tight">Sophie Vance</div>
              <div className="text-center text-[4px] text-emerald-200">Senior Staff Product Lead</div>

              {/* Contact Details */}
              <div className="mt-1.5 pt-1 border-t border-emerald-800/80 space-y-0.5">
                <div className="text-[4.4px] font-bold text-emerald-300 uppercase tracking-wider">
                  Contact
                </div>
                <div className="text-[3.7px] text-emerald-100 space-y-0.2">
                  <div>Seattle, WA</div>
                  <div>(206) 555-0192</div>
                  <div className="truncate">s.vance@tech.co</div>
                  <div className="truncate">sophievance.dev</div>
                  <div className="truncate">linkedin.com/in/svance</div>
                </div>
              </div>

              {/* Visual Skills Progress Bars */}
              <div className="mt-1.5 pt-1 border-t border-emerald-800/80">
                <div className="text-[4.4px] font-bold text-emerald-300 uppercase tracking-wider mb-0.5">
                  Skills Matrix
                </div>
                <div className="space-y-0.8">
                  <div>
                    <div className="flex justify-between text-[3.6px] text-emerald-200">
                      <span>Agile Roadmapping</span>
                      <span>96%</span>
                    </div>
                    <div className="w-full h-0.5 bg-emerald-950 rounded-full overflow-hidden">
                      <div className="w-[96%] h-full bg-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[3.6px] text-emerald-200">
                      <span>Checkout Systems</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full h-0.5 bg-emerald-950 rounded-full overflow-hidden">
                      <div className="w-[92%] h-full bg-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[3.6px] text-emerald-200">
                      <span>A/B Experimentation</span>
                      <span>90%</span>
                    </div>
                    <div className="w-full h-0.5 bg-emerald-950 rounded-full overflow-hidden">
                      <div className="w-[90%] h-full bg-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[3.6px] text-emerald-200">
                      <span>SQL & Data Modeling</span>
                      <span>86%</span>
                    </div>
                    <div className="w-full h-0.5 bg-emerald-950 rounded-full overflow-hidden">
                      <div className="w-[86%] h-full bg-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[3.6px] text-emerald-200">
                      <span>API Specifications</span>
                      <span>82%</span>
                    </div>
                    <div className="w-full h-0.5 bg-emerald-950 rounded-full overflow-hidden">
                      <div className="w-[82%] h-full bg-emerald-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div className="mt-1.5 pt-1 border-t border-emerald-800/80">
                <div className="text-[4.4px] font-bold text-emerald-300 uppercase tracking-wider mb-0.5">
                  Credentials
                </div>
                <div className="text-[3.6px] text-emerald-100 space-y-0.5">
                  <div>• CSPO® Certified Product Owner (2023)</div>
                  <div>• Pragmatic Institute Certified (PMC-III)</div>
                  <div>• Reforge Growth Series Fellow (2021)</div>
                </div>
              </div>

              {/* Languages */}
              <div className="mt-1.5 pt-1 border-t border-emerald-800/80">
                <div className="text-[4.4px] font-bold text-emerald-300 uppercase tracking-wider mb-0.5">
                  Languages
                </div>
                <div className="text-[3.6px] text-emerald-100 space-y-0.2">
                  <div className="flex justify-between"><span>English</span><span className="text-emerald-300 font-bold">Native (C2)</span></div>
                  <div className="flex justify-between"><span>German</span><span className="text-emerald-300 font-bold">Fluent (B2)</span></div>
                  <div className="flex justify-between"><span>Spanish</span><span className="text-emerald-300 font-bold">Proficient (B1)</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Main Content - Continuous packed flow */}
          <div className="w-[67%] p-1.5 sm:p-2 text-[4.3px] flex flex-col space-y-1 overflow-hidden">
            {/* Profile */}
            <div className="border-b border-slate-200 pb-0.8">
              <div className="text-[5px] font-bold text-[#064e3b] uppercase tracking-wider">
                Professional Profile
              </div>
              <p className="text-[3.9px] text-slate-700 mt-0.5 leading-tight">
                High-growth Product Leader with 8+ years scaling checkout infrastructure and B2B SaaS platforms. Directed cross-functional engineering pods of 35+ developers, lifting checkout conversions by 18% across 45,000 tier-1 merchants.
              </p>
            </div>

            {/* Employment History - 4 Full Roles */}
            <div className="space-y-0.8 border-b border-slate-200 pb-0.8">
              <div className="text-[5px] font-bold text-[#064e3b] uppercase tracking-wider">
                Employment History
              </div>

              <div>
                <div className="flex justify-between font-bold text-[4.3px] text-slate-800">
                  <span>Lead Product Manager • Stripe</span>
                  <span className="text-[3.6px] text-slate-500 font-normal">Mar 2021 – Present</span>
                </div>
                <p className="text-[3.7px] text-slate-600 leading-tight">
                  • Led 1-click checkout flow revamp, expanding merchant sales volume by $42M ARR.
                </p>
                <p className="text-[3.7px] text-slate-600 leading-tight">
                  • Directed multi-currency routing servicing 140 countries with sub-second latency.
                </p>
              </div>

              <div>
                <div className="flex justify-between font-bold text-[4.3px] text-slate-800">
                  <span>Senior Product Manager • Uber Technologies</span>
                  <span className="text-[3.6px] text-slate-500 font-normal">Jun 2018 – Feb 2021</span>
                </div>
                <p className="text-[3.7px] text-slate-600 leading-tight">
                  • Overhauled fleet dispatch analytics suite, boosting weekly driver retention by 16%.
                </p>
                <p className="text-[3.7px] text-slate-600 leading-tight">
                  • Shipped real-time trip verification features with 99.8% customer satisfaction score.
                </p>
              </div>

              <div>
                <div className="flex justify-between font-bold text-[4.3px] text-slate-800">
                  <span>Product Manager • Microsoft Azure</span>
                  <span className="font-normal text-[3.6px] text-slate-500">Aug 2016 – May 2018</span>
                </div>
                <p className="text-[3.7px] text-slate-600 leading-tight">
                  • Shipped Azure DevOps developer tools suite used by 450k active engineering teams.
                </p>
              </div>

              <div>
                <div className="flex justify-between font-bold text-[4.3px] text-slate-800">
                  <span>Associate PM • Atlassian</span>
                  <span className="font-normal text-[3.6px] text-slate-500">Jun 2014 – Jul 2016</span>
                </div>
                <p className="text-[3.7px] text-slate-600 leading-tight">
                  • Automated sprint backlog burndown telemetry across Jira cloud workspaces.
                </p>
              </div>
            </div>

            {/* Strategic Projects */}
            <div className="border-b border-slate-200 pb-0.8">
              <div className="text-[5px] font-bold text-[#064e3b] uppercase tracking-wider">
                Key Initiatives
              </div>
              <p className="text-[3.7px] text-slate-700 leading-tight">
                • <span className="font-semibold text-slate-900">Global Payout Gateway (2023):</span> Unified payout rails processing $3.4B annually across 24 localized payment methods.
              </p>
            </div>

            {/* Education - 2 Degrees */}
            <div>
              <div className="text-[5px] font-bold text-[#064e3b] uppercase tracking-wider mb-0.5">
                Education
              </div>
              <div className="space-y-0.3 text-[3.8px]">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>M.S. in Information Systems • Foster School of Business</span>
                  <span className="text-slate-500 font-normal">2016 – 2018</span>
                </div>
                <div className="flex justify-between font-bold text-slate-800">
                  <span>B.S. in Computer Science • Univ. of Washington</span>
                  <span className="text-slate-500 font-normal">2010 – 2014</span>
                </div>
                <p className="text-[3.5px] text-slate-500">Magna Cum Laude (GPA 3.89) • UW ACM Student President</p>
              </div>
            </div>
          </div>
        </div>
      );

    // =========================================================================
    // 3. MOMENTUM ATS (Gold Rule & Distinctive 8-Cell Expertise Matrix)
    // =========================================================================
    case 'momentum_ats':
      return (
        <div className="w-full h-full bg-white text-slate-900 p-2 sm:p-2.5 text-[4.3px] sm:text-[4.8px] leading-[1.2] font-sans flex flex-col space-y-1 select-none overflow-hidden">
          {/* Header with Signature Gold Accent Line */}
          <div className="pb-1 border-b-2 border-amber-500 shrink-0">
            <h4 className="text-[9px] font-bold tracking-tight text-slate-900">
              Jane Smith
            </h4>
            <div className="flex items-center justify-between text-[4.4px] text-slate-600 mt-0.5">
              <span className="font-bold text-amber-700">Vice President of Global Operations</span>
              <span className="text-[3.8px] text-slate-500 font-medium">Austin, TX • (512) 441-2900 • jane.smith@ops.io</span>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="shrink-0">
            <div className="text-[4.8px] font-bold uppercase tracking-wider text-slate-800 mb-0.2">
              Professional Summary
            </div>
            <p className="text-[3.9px] text-slate-700 leading-tight">
              Results-driven Operations Executive with 12+ years directing high-throughput manufacturing plants, cross-dock logistics, and multi-site distribution networks. Championed Lean Six Sigma initiatives delivering $14.2M in OPEX efficiency gains while managing 240+ personnel.
            </p>
          </div>

          {/* Distinctive 8-Cell (2x4) Areas of Expertise Grid */}
          <div className="shrink-0 p-1 bg-amber-50/80 rounded border border-amber-200/80">
            <div className="text-[4.4px] font-bold text-amber-900 uppercase tracking-wider mb-0.5">
              Areas of Strategic Expertise
            </div>
            <div className="grid grid-cols-4 gap-0.8 text-[3.6px] text-slate-800">
              <div className="bg-white px-0.8 py-0.2 rounded border border-amber-100 font-medium">◆ Process Ops</div>
              <div className="bg-white px-0.8 py-0.2 rounded border border-amber-100 font-medium">◆ Vendor Mgmt</div>
              <div className="bg-white px-0.8 py-0.2 rounded border border-amber-100 font-medium">◆ Lean Six Sigma</div>
              <div className="bg-white px-0.8 py-0.2 rounded border border-amber-100 font-medium">◆ P&L Ownership</div>
              <div className="bg-white px-0.8 py-0.2 rounded border border-amber-100 font-medium">◆ Supply Chain</div>
              <div className="bg-white px-0.8 py-0.2 rounded border border-amber-100 font-medium">◆ ERP Migration</div>
              <div className="bg-white px-0.8 py-0.2 rounded border border-amber-100 font-medium">◆ OKR Frameworks</div>
              <div className="bg-white px-0.8 py-0.2 rounded border border-amber-100 font-medium">◆ Cross-Docking</div>
            </div>
          </div>

          {/* Professional Experience - 4 Chronological Roles */}
          <div className="shrink-0 space-y-0.8">
            <div className="text-[4.8px] font-bold uppercase tracking-wider text-slate-800">
              Professional Experience
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 text-[4.3px]">
                <span>Director of Operations • Tesla Motors</span>
                <span className="text-[3.6px] text-slate-500 font-normal">Jan 2021 – Present</span>
              </div>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                • Decreased battery module assembly cycle times by 24% while managing 160 robotic automation technicians.
              </p>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                • Lowered annualized material handling scrap by $3.8M by deploying computer vision QA sensors.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 text-[4.3px]">
                <span>Senior Operations Manager • Flex Logistics</span>
                <span className="text-[3.6px] text-slate-500 font-normal">Jun 2017 – Dec 2020</span>
              </div>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                • Overhauled kanban replenishment workflows, elevating distribution throughput by 31%.
              </p>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                • Maintained inventory variance under 0.05% across 4 primary multi-client distribution warehouses.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 text-[4.3px]">
                <span>Manufacturing Systems Engineer • Boeing</span>
                <span className="text-[3.6px] text-slate-500 font-normal">Aug 2014 – May 2017</span>
              </div>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                • Automated wing structure sealant inspection, cutting rework labor hours by 420 hours annually.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 text-[4.3px]">
                <span>Plant Operations Supervisor • Caterpillar</span>
                <span className="text-[3.6px] text-slate-500 font-normal">Jun 2011 – Jul 2014</span>
              </div>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                • Supervised 3-shift assembly floor achieving 1,000+ days without a lost-time workplace safety incident.
              </p>
            </div>
          </div>

          {/* Education & Credentials - Fully Filled */}
          <div className="shrink-0 pt-0.5 border-t border-slate-200 space-y-0.3">
            <div className="flex justify-between text-[4px] text-slate-800">
              <span className="font-bold">MBA in Global Operations • UT Austin McCombs School of Business</span>
              <span className="text-slate-500 text-[3.6px]">2014 – 2016</span>
            </div>
            <div className="flex justify-between text-[4px] text-slate-800">
              <span className="font-bold">B.S. in Industrial & Systems Engineering • Texas A&M University</span>
              <span className="text-slate-500 text-[3.6px]">2007 – 2011</span>
            </div>
            <div className="flex justify-between text-[3.6px] text-slate-600 pt-0.2">
              <span>Six Sigma Master Black Belt (CSSMBB, 2022)</span>
              <span>APICS CSCP Certified (2020)</span>
              <span>OSHA 30-Hour General Industry (2019)</span>
            </div>
          </div>
        </div>
      );

    // =========================================================================
    // 4. CLASSIC ATS (Centered Minimalist & 100% Recruiter Compliance)
    // =========================================================================
    case 'classic_ats':
      return (
        <div className="w-full h-full bg-white text-slate-900 p-2 sm:p-2.5 text-[4.3px] sm:text-[4.8px] leading-[1.2] font-sans flex flex-col space-y-1 select-none overflow-hidden">
          {/* Minimalist Centered Header */}
          <div className="text-center pb-1 border-b border-slate-900 shrink-0">
            <h4 className="text-[9px] font-bold text-slate-900 uppercase tracking-widest">
              Logan Mitchell
            </h4>
            <div className="text-[3.8px] text-slate-600 mt-0.5 space-x-1.5 font-mono">
              <span>San Francisco, CA</span>
              <span>•</span>
              <span>(415) 890-2411</span>
              <span>•</span>
              <span>logan.mitchell@dev.io</span>
              <span>•</span>
              <span>github.com/lmitchell</span>
              <span>•</span>
              <span>lmitchell-systems.net</span>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="shrink-0">
            <div className="text-[4.8px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.2 mb-0.2">
              Professional Summary
            </div>
            <p className="text-[3.9px] text-slate-700 leading-tight">
              Staff Software Engineer with 8+ years architecting distributed telemetry pipelines, high-throughput Go microservices, and PostgreSQL sharding. Authored open-source Raft consensus implementations deployed in production across 60+ enterprise clusters.
            </p>
          </div>

          {/* Technical Skills Matrix */}
          <div className="shrink-0">
            <div className="text-[4.8px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.2 mb-0.2">
              Technical Proficiencies
            </div>
            <div className="space-y-0.4 text-[3.6px] text-slate-700 font-mono">
              <div><span className="font-bold text-slate-900">Languages:</span> Go, Rust, TypeScript, Python, C++, SQL, eBPF</div>
              <div><span className="font-bold text-slate-900">Distributed Infrastructure:</span> Kubernetes, Apache Kafka, gRPC, Redis Cluster, Envoy, Docker</div>
              <div><span className="font-bold text-slate-900">Storage & Cloud:</span> PostgreSQL (Citus), Cassandra, AWS (EKS, Aurora, S3), Terraform, Prometheus</div>
            </div>
          </div>

          {/* Experience - 4 Roles */}
          <div className="shrink-0 space-y-0.8">
            <div className="text-[4.8px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.2">
              Work Experience
            </div>

            <div>
              <div className="flex justify-between font-bold text-[4.3px] text-slate-800">
                <span>Staff Distributed Systems Engineer • Datadog</span>
                <span className="text-[3.6px] text-slate-500 font-normal font-mono">Mar 2021 – Present</span>
              </div>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                - Architected telemetry ingestion pipelines processing 450k events/sec with zero packet loss at 99.999% SLA.
              </p>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                - Cut p99 tail latency from 140ms to 18ms through zero-allocation memory pooling in Go.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-[4.3px] text-slate-800">
                <span>Senior Backend Engineer • Twilio</span>
                <span className="text-[3.6px] text-slate-500 font-normal font-mono">Jun 2018 – Feb 2021</span>
              </div>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                - Engineered carrier SMS dispatch router reducing dispatch latency by 32ms across 40 global carriers.
              </p>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                - Implemented automated canary deployment verifier with automated rollback upon error budget breach.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-[4.3px] text-slate-800">
                <span>Distributed Systems Developer • Dropbox</span>
                <span className="text-[3.6px] text-slate-500 font-normal font-mono">Aug 2016 – May 2018</span>
              </div>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                - Built block-level chunk deduplication algorithm supporting petabyte-scale synchronization.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-[4.3px] text-slate-800">
                <span>Software Engineer • Cloudflare</span>
                <span className="text-[3.6px] text-slate-500 font-normal font-mono">Jun 2014 – Jul 2016</span>
              </div>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                - Optimized edge HTTP/2 reverse proxy terminating 80k TLS handshakes per second.
              </p>
            </div>
          </div>

          {/* Education & Open Source */}
          <div className="shrink-0 pt-0.5 border-t border-slate-300 space-y-0.3">
            <div className="flex justify-between text-[4px] text-slate-800">
              <span className="font-bold">M.S. in Computer Science • Stanford University</span>
              <span className="text-slate-500 font-mono text-[3.6px]">2014 – 2016</span>
            </div>
            <div className="flex justify-between text-[4px] text-slate-800">
              <span className="font-bold">B.S. in Electrical Engineering & CS • UC Berkeley</span>
              <span className="text-slate-500 font-mono text-[3.6px]">2010 – 2014</span>
            </div>
            <p className="text-[3.5px] text-slate-600 font-mono">
              Open Source: Core Maintainer of RaftGo (4.2k GitHub Stars) • CNCF Envoy Contributor
            </p>
          </div>
        </div>
      );

    // =========================================================================
    // 5. PRIME ATS (Corporate Blue • Headshot Badge • Dense Flow)
    // =========================================================================
    case 'prime_ats':
      return (
        <div className="w-full h-full bg-white text-slate-900 p-2 sm:p-2.5 text-[4.3px] sm:text-[4.8px] leading-[1.2] font-sans flex flex-col space-y-1 select-none overflow-hidden">
          {/* Header with Top-Right Headshot Badge */}
          <div className="flex items-start justify-between pb-1 border-b-2 border-blue-600 shrink-0">
            <div>
              <h4 className="text-[9px] font-extrabold tracking-tight text-blue-700 uppercase">
                Herman Walton
              </h4>
              <p className="text-[4.8px] font-bold text-slate-800">Senior Financial Systems & Enterprise ERP Analyst</p>
              <div className="text-[3.8px] text-slate-500 mt-0.5 space-x-1.5">
                <span>Boston, MA</span>
                <span>•</span>
                <span>(617) 555-8912</span>
                <span>•</span>
                <span>h.walton@finance.org</span>
                <span>•</span>
                <span>linkedin.com/in/hwalton</span>
              </div>
            </div>
            <div className="w-6 h-6 rounded bg-blue-100 border border-blue-300 flex items-center justify-center text-[6px] font-bold text-blue-700 shadow-2xs shrink-0">
              HW
            </div>
          </div>

          {/* Professional Summary */}
          <div className="shrink-0">
            <div className="text-[4.8px] font-bold uppercase tracking-wider text-blue-700 border-b border-blue-200 pb-0.2 mb-0.2">
              Professional Summary
            </div>
            <p className="text-[3.9px] text-slate-700 leading-tight">
              Quantitative Financial Systems Analyst with 8+ years building enterprise cash forecasting models, leading SAP S/4HANA migrations, and managing fiscal auditing compliance. Accelerated monthly financial ledger closes from 8 days to 3 business days across 18 subsidiaries.
            </p>
          </div>

          {/* Experience - 4 Roles */}
          <div className="shrink-0 space-y-0.8">
            <div className="text-[4.8px] font-bold uppercase tracking-wider text-blue-700 border-b border-blue-200 pb-0.2">
              Professional Experience
            </div>

            <div>
              <div className="flex justify-between font-bold text-[4.3px] text-slate-800">
                <span>Lead Financial Systems Analyst • State Street</span>
                <span className="text-[3.6px] text-slate-500 font-normal">Jan 2021 – Present</span>
              </div>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                • Built automated capital liquidity forecasting model monitoring $180M in daily transaction flows.
              </p>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                • Directed automated reconciliation pipeline reducing unallocated suspense balances by 94%.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-[4.3px] text-slate-800">
                <span>Senior Financial Analyst • PwC Advisory</span>
                <span className="text-[3.6px] text-slate-500 font-normal">Jun 2018 – Dec 2020</span>
              </div>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                • Conducted SOX 404 audit testing and internal control validations for 16 Fortune 500 corporate clients.
              </p>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                • Constructed 3-statement dynamic valuation models supporting $340M in completed M&A acquisitions.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-[4.3px] text-slate-800">
                <span>Financial Analyst • Fidelity Investments</span>
                <span className="text-[3.6px] text-slate-500 font-normal">Aug 2016 – May 2018</span>
              </div>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                • Programmed Python scripts reconciling mutual fund NAV pricing with Bloomberg feeds in real-time.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-[4.3px] text-slate-800">
                <span>Treasury Operations Analyst • BNY Mellon</span>
                <span className="text-[3.6px] text-slate-500 font-normal">Jun 2014 – Jul 2016</span>
              </div>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                • Managed daily collateral margin calls for fixed-income repo and foreign exchange hedging books.
              </p>
            </div>
          </div>

          {/* Education - 2 Degrees */}
          <div className="shrink-0 space-y-0.3">
            <div className="text-[4.8px] font-bold uppercase tracking-wider text-blue-700 border-b border-blue-200 pb-0.2 mb-0.2">
              Education & Honors
            </div>
            <div className="flex justify-between text-[4px] text-slate-800">
              <span className="font-bold">M.S. in Quantitative Finance • Boston University</span>
              <span className="text-slate-500 text-[3.6px]">2016 – 2018</span>
            </div>
            <div className="flex justify-between text-[4px] text-slate-800">
              <span className="font-bold">B.S. in Economics & Finance • Boston College</span>
              <span className="text-slate-500 text-[3.6px]">2010 – 2014</span>
            </div>
            <p className="text-[3.5px] text-slate-600">Magna Cum Laude • CFA Charterholder • FRM Certified</p>
          </div>

          {/* Technical Tools */}
          <div className="shrink-0">
            <div className="text-[4.8px] font-bold uppercase tracking-wider text-blue-700 border-b border-blue-200 pb-0.2 mb-0.2">
              Financial Tools & Modeling Systems
            </div>
            <div className="grid grid-cols-3 gap-0.8 text-[3.6px] text-slate-700">
              <span className="bg-slate-100 px-1 py-0.2 rounded font-medium">SAP S/4HANA & Oracle ERP</span>
              <span className="bg-slate-100 px-1 py-0.2 rounded font-medium">Bloomberg & FactSet</span>
              <span className="bg-slate-100 px-1 py-0.2 rounded font-medium">SQL & PowerBI Dashboards</span>
              <span className="bg-slate-100 px-1 py-0.2 rounded font-medium">Python (Pandas, NumPy)</span>
              <span className="bg-slate-100 px-1 py-0.2 rounded font-medium">DCF & LBO Financial Models</span>
              <span className="bg-slate-100 px-1 py-0.2 rounded font-medium">VBA Macro Automation</span>
            </div>
          </div>
        </div>
      );

    // =========================================================================
    // 6. MODERN CLEAN (FlowCV Contemporary • Vertical Blue Pill Accent)
    // =========================================================================
    case 'modern_clean':
      return (
        <div className="w-full h-full bg-white text-slate-900 p-2 sm:p-2.5 text-[4.3px] sm:text-[4.8px] leading-[1.2] font-sans flex flex-col space-y-1 select-none overflow-hidden">
          {/* Header with Blue Left Accent Pill */}
          <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100 shrink-0">
            <div className="w-1 h-6 bg-blue-600 rounded-full shrink-0" />
            <div>
              <h4 className="text-[8.5px] font-black text-slate-900 tracking-tight">
                Alex Vance
              </h4>
              <p className="text-[4.6px] font-semibold text-blue-600">Lead Cloud Architect & Staff Engineer</p>
              <p className="text-[3.8px] text-slate-500">alex.vance@techstudio.dev • (415) 890-2411 • San Francisco, CA • alexvance.dev</p>
            </div>
          </div>

          {/* Summary */}
          <div className="shrink-0">
            <div className="text-[4.8px] font-bold text-slate-900 uppercase tracking-wide mb-0.2 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-blue-600" />
              Professional Summary
            </div>
            <p className="text-[3.9px] text-slate-700 leading-tight">
              Solutions Architect with 8+ years designing resilient distributed microservices, Kubernetes clusters, and reactive web applications. Track record of spearheading cloud migrations that reduced operational expenditures by 38% while scaling to 15M+ monthly active users.
            </p>
          </div>

          {/* Experience - 4 Roles */}
          <div className="shrink-0 space-y-0.8">
            <div className="text-[4.8px] font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-blue-600" />
              Work Experience
            </div>

            <div>
              <div className="flex justify-between font-bold text-[4.3px] text-slate-800">
                <span>Lead Cloud Architect • Apex Cloud Systems</span>
                <span className="text-[3.6px] text-slate-500 font-normal">Mar 2021 – Present</span>
              </div>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                • Architected event-driven microservices architecture servicing 12M+ concurrent requests with 99.995% uptime.
              </p>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                • Spearheaded Kubernetes cluster optimization, slashing cloud compute costs by 34% ($420k/yr savings).
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-[4.3px] text-slate-800">
                <span>Senior Software Engineer • Veloce Data Labs</span>
                <span className="text-[3.6px] text-slate-500 font-normal">Jun 2018 – Feb 2021</span>
              </div>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                • Built real-time analytics streaming ingestion pipeline processing 2.5B daily events using Go and Apache Kafka.
              </p>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                • Authored reusable TypeScript component system adopted across 8 distinct internal SaaS products.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-[4.3px] text-slate-800">
                <span>Full Stack Engineer • Hyperion Interactive</span>
                <span className="text-[3.6px] text-slate-500 font-normal">Aug 2016 – May 2018</span>
              </div>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                • Developed responsive single-page web applications with React, GraphQL, and Node.js for retail clients.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-[4.3px] text-slate-800">
                <span>Frontend Engineer • CloudStudio</span>
                <span className="text-[3.6px] text-slate-500 font-normal">Jun 2014 – Jul 2016</span>
              </div>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                • Built drag-and-drop workflow canvas utilizing HTML5 Canvas and WebSockets.
              </p>
            </div>
          </div>

          {/* Education - 2 Degrees */}
          <div className="shrink-0 space-y-0.3">
            <div className="text-[4.8px] font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-blue-600" />
              Education & Honors
            </div>
            <div className="flex justify-between text-[4px] text-slate-800">
              <span className="font-bold">M.S. in Computer Science • University of Washington</span>
              <span className="text-slate-500 text-[3.6px]">2016 – 2018</span>
            </div>
            <div className="flex justify-between text-[4px] text-slate-800">
              <span className="font-bold">B.S. in Computer Engineering • University of Washington</span>
              <span className="text-slate-500 text-[3.6px]">2010 – 2014</span>
            </div>
          </div>

          {/* Skills Badges */}
          <div className="shrink-0">
            <div className="text-[4.8px] font-bold text-slate-900 uppercase tracking-wide mb-0.5 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-blue-600" />
              Skills & Tech Stack
            </div>
            <div className="flex flex-wrap gap-0.8 text-[3.6px]">
              <span className="px-1 py-0.2 bg-blue-50 text-blue-700 rounded font-semibold">React 19 & Next.js</span>
              <span className="px-1 py-0.2 bg-blue-50 text-blue-700 rounded font-semibold">TypeScript</span>
              <span className="px-1 py-0.2 bg-blue-50 text-blue-700 rounded font-semibold">Go & Rust</span>
              <span className="px-1 py-0.2 bg-blue-50 text-blue-700 rounded font-semibold">Kubernetes (EKS)</span>
              <span className="px-1 py-0.2 bg-blue-50 text-blue-700 rounded font-semibold">PostgreSQL & Citus</span>
              <span className="px-1 py-0.2 bg-blue-50 text-blue-700 rounded font-semibold">Terraform & AWS</span>
              <span className="px-1 py-0.2 bg-blue-50 text-blue-700 rounded font-semibold">Kafka & Redis</span>
              <span className="px-1 py-0.2 bg-blue-50 text-blue-700 rounded font-semibold">GraphQL & gRPC</span>
            </div>
          </div>
        </div>
      );

    // =========================================================================
    // 7. EXECUTIVE MINIMALIST (Editorial Prestige Serif • C-Suite Boardroom)
    // =========================================================================
    case 'executive_minimalist':
      return (
        <div className="w-full h-full bg-white text-slate-900 p-2 sm:p-2.5 text-[4.3px] sm:text-[4.8px] leading-[1.2] font-serif flex flex-col space-y-1 select-none overflow-hidden">
          {/* Centered Editorial Header */}
          <div className="text-center pb-1 border-b border-slate-300 shrink-0">
            <h4 className="text-[9px] font-normal tracking-widest uppercase text-slate-900">
              Eleanor Vance
            </h4>
            <p className="text-[4.6px] text-slate-600 font-sans tracking-wide mt-0.2">
              Chief Operating Officer & Board Director
            </p>
            <p className="text-[3.8px] text-slate-500 font-sans mt-0.2">
              New York, NY • e.vance@leadership.com • (212) 555-0199 • linkedin.com/in/eleanorvance
            </p>
          </div>

          {/* Executive Summary */}
          <div className="shrink-0 text-center px-1">
            <p className="text-[3.9px] text-slate-700 italic leading-tight">
              Transformational C-Suite Executive with 18+ years driving global enterprise turnarounds, cross-border M&A transactions, and operational governance. Managed operating P&L portfolios exceeding $450M across 14 international jurisdictions.
            </p>
          </div>

          {/* Executive Leadership - 4 Roles */}
          <div className="shrink-0 space-y-0.8">
            <div className="text-center text-[4.8px] font-bold tracking-widest uppercase text-slate-800 mb-0.2">
              Executive Leadership History
            </div>

            <div>
              <div className="flex justify-between font-bold text-[4.3px] text-slate-800">
                <span>Chief Operating Officer • Omnicom Global</span>
                <span className="font-sans text-[3.6px] text-slate-500 font-normal">Jan 2019 – Present</span>
              </div>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                • Oversaw $320M annual budget across 4 operating divisions; elevated corporate operating margins by 19%.
              </p>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                • Led cross-border acquisition integration of 3 European entities representing $180M combined valuation.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-[4.3px] text-slate-800">
                <span>Executive Vice President • McKesson International</span>
                <span className="font-sans text-[3.6px] text-slate-500 font-normal">May 2014 – Dec 2018</span>
              </div>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                • Restructured national logistics footprint, consolidating 18 distribution centers into 6 automated hubs.
              </p>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                • Spearheaded enterprise ERP transformation reducing redundant software spend by $24M.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-[4.3px] text-slate-800">
                <span>Managing Director • McKinsey & Company</span>
                <span className="font-sans text-[3.6px] text-slate-500 font-normal">Aug 2008 – Apr 2014</span>
              </div>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                • Advised Fortune 50 CEOs on strategic operational restructuring, capital governance, and market entry.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-[4.3px] text-slate-800">
                <span>Senior Engagement Manager • BCG</span>
                <span className="font-sans text-[3.6px] text-slate-500 font-normal">Jun 2004 – Jul 2008</span>
              </div>
              <p className="text-[3.7px] text-slate-600 pl-1 leading-tight">
                • Directed supply chain turnaround for global consumer packaged goods manufacturer.
              </p>
            </div>
          </div>

          {/* Board Appointments */}
          <div className="shrink-0">
            <div className="text-center text-[4.8px] font-bold tracking-widest uppercase text-slate-800 mb-0.2">
              Board Governance & Directorships
            </div>
            <div className="space-y-0.3 text-[3.8px] text-slate-700">
              <div className="flex justify-between font-medium">
                <span>Independent Board Director & Audit Committee Chair</span>
                <span className="text-slate-500 font-sans">Nexa Tech Inc (NASDAQ: NXA) • 2021 – Present</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Board Trustee & Governance Member</span>
                <span className="text-slate-500 font-sans">Columbia Health Foundation • 2018 – Present</span>
              </div>
            </div>
          </div>

          {/* Education & Honors */}
          <div className="shrink-0 pt-0.5 border-t border-slate-200 space-y-0.3">
            <div className="flex justify-between text-[4px] text-slate-800">
              <span className="font-bold">MBA with High Distinction • Columbia Business School (Baker Scholar)</span>
              <span className="text-slate-500 font-sans text-[3.6px]">2002 – 2004</span>
            </div>
            <div className="flex justify-between text-[4px] text-slate-800">
              <span className="font-bold">B.A. in International Relations & Economics • Dartmouth College</span>
              <span className="text-slate-500 font-sans text-[3.6px]">1998 – 2002</span>
            </div>
            <p className="text-[3.5px] text-slate-600 font-sans text-center pt-0.2">
              National Association of Corporate Directors (NACD) Certified Director • Harvard Leadership Fellow
            </p>
          </div>
        </div>
      );

    // =========================================================================
    // 8. MINIMALIST ATS (Pure Monochrome Systems Engineering)
    // =========================================================================
    case 'minimal':
    default:
      return (
        <div className="w-full h-full bg-white text-zinc-900 p-2 sm:p-2.5 text-[4.3px] sm:text-[4.8px] leading-[1.2] font-sans flex flex-col space-y-1 select-none overflow-hidden">
          {/* Header */}
          <div className="pb-1 border-b border-zinc-900 shrink-0">
            <h4 className="text-[8.5px] font-bold tracking-tight uppercase text-zinc-950">
              Alexander Wright
            </h4>
            <div className="flex items-center justify-between text-[3.8px] text-zinc-600 mt-0.5 font-mono">
              <span>Staff Distributed Systems Engineer</span>
              <span>San Francisco, CA • awright.dev • github.com/awright</span>
            </div>
          </div>

          {/* Summary */}
          <div className="shrink-0">
            <div className="text-[4.8px] font-bold uppercase tracking-wider text-zinc-950 mb-0.2 border-b border-zinc-200 pb-0.2">
              Technical Summary
            </div>
            <p className="text-[3.9px] text-zinc-700 leading-tight">
              Staff Systems Engineer with 9+ years engineering low-latency distributed databases, consensus protocols, and zero-allocation networking engines. Author of widely deployed open-source Raft implementations utilized across high-concurrency fintech ledgers.
            </p>
          </div>

          {/* Experience - 4 Roles */}
          <div className="shrink-0 space-y-0.8">
            <div className="text-[4.8px] font-bold uppercase tracking-wider text-zinc-950 mb-0.2 border-b border-zinc-200 pb-0.2">
              Professional Systems Experience
            </div>

            <div>
              <div className="flex justify-between font-bold text-[4.3px] text-zinc-900">
                <span>Staff Systems Engineer • Stripe</span>
                <span className="font-mono text-[3.6px] text-zinc-500">Mar 2021 – Present</span>
              </div>
              <p className="text-[3.7px] text-zinc-600 pl-1 leading-tight">
                • Designed high-throughput ledger services processing 45k tx/sec with 99.999% SLA.
              </p>
              <p className="text-[3.7px] text-zinc-600 pl-1 leading-tight">
                • Spearheaded zero-downtime consensus upgrade across 8 global multi-region clusters.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-[4.3px] text-zinc-900">
                <span>Senior Systems Engineer • Cloudflare</span>
                <span className="font-mono text-[3.6px] text-zinc-500">Jun 2018 – Feb 2021</span>
              </div>
              <p className="text-[3.7px] text-zinc-600 pl-1 leading-tight">
                • Authored Rust edge proxy runtime, elevating edge cache hit ratio by 28%.
              </p>
              <p className="text-[3.7px] text-zinc-600 pl-1 leading-tight">
                • Engineered zero-copy memory buffers reducing CPU utilization by 40%.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-[4.3px] text-zinc-900">
                <span>Systems Engineer • Fastly</span>
                <span className="font-mono text-[3.6px] text-zinc-500">Aug 2016 – May 2018</span>
              </div>
              <p className="text-[3.7px] text-zinc-600 pl-1 leading-tight">
                • Developed custom DDoS mitigation packet filters handling 100Gbps line-rate traffic.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-[4.3px] text-zinc-900">
                <span>Linux Kernel Intern • Red Hat</span>
                <span className="font-mono text-[3.6px] text-zinc-500">Jun 2014 – Jul 2016</span>
              </div>
              <p className="text-[3.7px] text-zinc-600 pl-1 leading-tight">
                • Contributed patchsets to Linux netfilter subsystem optimizing socket buffer allocation.
              </p>
            </div>
          </div>

          {/* Core Competencies */}
          <div className="shrink-0">
            <div className="text-[4.8px] font-bold uppercase tracking-wider text-zinc-950 mb-0.2 border-b border-zinc-200 pb-0.2">
              Core Competencies
            </div>
            <p className="text-[3.7px] text-zinc-700 font-mono">
              Go, Rust, C++, Linux eBPF, Distributed Consensus, Raft, Kubernetes, Zero-Trust, Envoy Proxy, Citus DB
            </p>
          </div>

          {/* Education & Patents */}
          <div className="shrink-0 pt-0.5 border-t border-zinc-200 space-y-0.3">
            <div className="flex justify-between text-[4px] text-zinc-800">
              <span className="font-medium">M.S. in Computer Engineering • UC Berkeley</span>
              <span className="font-mono text-zinc-500 text-[3.6px]">2014 – 2016</span>
            </div>
            <div className="flex justify-between text-[4px] text-zinc-800">
              <span className="font-medium">B.S. in Computer Science • UC Berkeley</span>
              <span className="font-mono text-zinc-500 text-[3.6px]">2010 – 2014</span>
            </div>
            <p className="text-[3.5px] text-zinc-500 font-mono">
              Patent US-10892104: Low-latency distributed ledger synchronization across asynchronous nodes
            </p>
          </div>
        </div>
      );
  }
};
