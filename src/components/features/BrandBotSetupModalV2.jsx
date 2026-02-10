import React, { useState, useEffect, useRef } from 'react';
import '../../styles/BrandBotSetupModalV2.scss';

const buildResearchTasks = () => ([
  { id: 'planning', label: 'Planning research steps...', status: 'processing' },
  { id: 'finalizing', label: 'Finalizing research...', status: 'pending' }
]);

const buildCompanyContextFlow = () => ({
  status: 'form',
  approved: false,
  researchPhase: 'planning',
  researchTasks: buildResearchTasks()
});

const companyContextTLDR = {
  title: 'Company Information',
  subtitle: 'MFG (Microfield Graphics, Inc) runs MFG.com, a global B2B marketplace and software platform for custom manufacturing that connects buyers who need custom parts with manufacturers who can make them.',
  description: 'The platform streamlines RFQ-to-order workflows and positions MFG as a secure, scalable marketplace for custom manufacturing.',
  sections: [
    {
      title: 'What it does',
      items: [
        'Helps buyers post RFQs (with CAD/specs), collect and compare quotes, award jobs, and manage supplier relationships end-to-end in one workflow.'
      ]
    },
    {
      title: 'Core positioning',
      items: [
        'The world\'s largest custom manufacturing marketplace, emphasizing scale, trust, and speed (not just a directory or job board).'
      ]
    },
    {
      title: 'Who it serves',
      items: [
        'Two-sided network - buyers (engineers, sourcing, procurement) and suppliers (machine shops, fabricators, contract manufacturers).'
      ]
    },
    {
      title: 'Buyer value',
      items: [
        'Faster sourcing, better supplier matching, more quote transparency, reduced risk vs. email/spreadsheets.'
      ]
    },
    {
      title: 'Manufacturer value',
      items: [
        'Steadier pipeline of high-intent RFQs, broader reach, stronger online visibility, faster quoting and better win rates.'
      ]
    },
    {
      title: 'Products/pillars',
      items: [
        '(1) RFQ-to-order marketplace',
        '(2) manufacturer directory + shop profiles',
        '(3) AI Quote Assist to draft/accelerate professional quotes.'
      ]
    },
    {
      title: 'How it makes money',
      items: [
        'Pay-per-RFQ access for manufacturers, premium subscriptions (more visibility/unlimited opportunities), plus upsells like AI quoting tools and discounted raw-material sourcing.'
      ]
    },
    {
      title: 'Brand voice',
      items: [
        'Professional, trustworthy, plain-spoken, outcome-focused; highlight dual-sided value and "marketplace + AI + workflow" as the key differentiator.'
      ]
    },
    {
      title: 'Example in practice',
      items: [
        'A sourcing manager posts one RFQ, receives multiple comparable quotes quickly, and awards work while a small machine shop uses AI Quote Assist to respond faster and win more jobs.'
      ]
    }
  ]
};

const positioningTLDR = {
  title: 'Positioning',
  subtitle: 'MFG.com positions itself as a secure, global RFQ-driven marketplace that efficiently matches custom-part buyers with qualified manufacturers, emphasizing scale (world\'s largest online manufacturing marketplace) and end-to-end workflow on one platform.',
  description: 'The positioning centers on scale, security, and a streamlined RFQ-to-order process for custom manufacturing.',
  sections: [
    {
      title: 'Value proposition',
      items: [
        'Connects buyers and suppliers of custom-manufactured parts in one marketplace.',
        'Buyers create RFQs with CAD files and technical specifications; RFQs are matched to suppliers with the right equipment, expertise, and capacity.',
        'Everything happens on-platform to drive efficiency and return on investment, with an emphasis on quality and security.'
      ]
    },
    {
      title: 'Target audience',
      items: [
        'Buyers: engineers, purchasers, industrial designers, and other sourcing professionals posting RFQs for custom parts.',
        'Suppliers: contract manufacturers, job shops, and other providers of contract manufacturing services responding to RFQs.',
        'Buyers can source across many categories (e.g., machining, molding, fabrication, stamping, assembly, rapid prototyping).'
      ]
    },
    {
      title: 'Brand feel',
      items: [
        'World\'s largest + secure signals a big, established, risk-aware partner for industrial procurement.',
        'Automated matching (right equipment, expertise and capacity at the right moment) creates a fast and smart feel rather than a static directory.',
        'Everything happens on the platform reinforces a controlled, process-driven experience.'
      ]
    }
  ]
};

const customersTLDR = {
  title: 'Customers / ICPs',
  subtitle: 'MFG serves a two-sided marketplace of industrial buyers and contract manufacturers responding to RFQs for custom parts.',
  description: 'Ideal customers need secure, efficient sourcing workflows and reliable supplier matching across manufacturing categories.',
  sections: [
    {
      title: 'Buyer ICPs',
      items: [
        'Engineers, procurement, and sourcing teams who need custom parts with clear specs and CAD files.',
        'Industrial designers and program managers coordinating complex builds and timelines.',
        'Mid-to-large enterprises seeking compliant, secure supplier selection.'
      ]
    },
    {
      title: 'Supplier ICPs',
      items: [
        'Contract manufacturers and job shops with machining, fabrication, molding, or stamping capabilities.',
        'Suppliers looking for steady RFQ volume and faster quoting workflows.',
        'Shops prepared to meet quality, security, and qualification requirements.'
      ]
    },
    {
      title: 'Sourcing categories',
      items: [
        'Machining, molding, fabrication, stamping, assembly, and rapid prototyping.'
      ]
    }
  ]
};

const brandElementsTLDR = {
  title: 'Brand Ella-ments',
  subtitle: 'MFG\'s brand elements are built to project professionalism and trust in a high-stakes environment (drawings, specs, supplier qualification), while keeping messaging centered on practical workflow outcomes - post RFQs, get matched, compare quotes, and transact securely.',
  description: 'Tone and messaging reinforce professionalism, security, and operational efficiency for both buyers and suppliers.',
  sections: [
    {
      title: 'Brand tone',
      items: [
        'Professional and credibility-forward (enterprise/procurement-friendly, not casual).',
        'Security- and quality-oriented, reflecting the sensitivity of engineering documents and supplier selection.',
        'Efficiency-focused, with explicit language around efficiency/ROI.'
      ]
    },
    {
      title: 'Brand voice',
      items: [
        'Direct, operational language rooted in sourcing actions (create RFQ, match, quote, search/filter).',
        'Two-sided phrasing that speaks to both buyers and suppliers as core users of the marketplace.',
        'Category-specific and manufacturing-literate (custom parts, contract manufacturing, job shops).'
      ]
    },
    {
      title: 'Key messaging',
      items: [
        'Putting buyers and suppliers of custom-manufactured parts together.',
        'The world\'s largest online manufacturing marketplace.',
        'Secure online marketplace where buyers create RFQs with CAD/specs and get automatically matched to the right suppliers globally.',
        'Everything happens on the MFG.com platform, positioned to ensure quality and security.'
      ]
    }
  ]
};

const tldrByStep = {
  positioning: positioningTLDR,
  customers: customersTLDR,
  brandElements: brandElementsTLDR
};

const joinItems = (items) => items.join(' ');

const buildSegment = ({ id, label, suggestion, chatPrompt }) => ({
  id,
  label,
  suggestion,
  chatPrompt
});

const buildSegmentFlow = () => ({
  positioning: {
    status: 'researching',
    approved: false,
    researchPhase: 'planning',
    researchTasks: buildResearchTasks(),
    segments: [
      buildSegment({
        id: 'valueProposition',
        label: 'Value Proposition',
        suggestion: joinItems(positioningTLDR.sections[0].items),
        chatPrompt: 'What would you like to refine about the Value Proposition?'
      }),
      buildSegment({
        id: 'targetAudience',
        label: 'Target Audience',
        suggestion: joinItems(positioningTLDR.sections[1].items),
        chatPrompt: 'Who should this message resonate with most?'
      }),
      buildSegment({
        id: 'brandFeel',
        label: 'Brand Feel',
        suggestion: joinItems(positioningTLDR.sections[2].items),
        chatPrompt: 'How should people feel after engaging with the brand?'
      })
    ]
  },
  customers: {
    status: 'researching',
    approved: false,
    researchPhase: 'planning',
    researchTasks: buildResearchTasks(),
    segments: [
      buildSegment({
        id: 'icpDetails',
        label: 'ICP Details',
        suggestion: joinItems(customersTLDR.sections.flatMap(section => section.items)),
        chatPrompt: 'What details should Ella adjust about your ideal customer profile?'
      })
    ]
  },
  brandElements: {
    status: 'researching',
    approved: false,
    researchPhase: 'planning',
    researchTasks: buildResearchTasks(),
    segments: [
      buildSegment({
        id: 'brandTone',
        label: 'Brand Tone',
        suggestion: joinItems(brandElementsTLDR.sections[0].items),
        chatPrompt: 'What tone changes would you like to make?'
      }),
      buildSegment({
        id: 'brandVoice',
        label: 'Brand Voice',
        suggestion: joinItems(brandElementsTLDR.sections[1].items),
        chatPrompt: 'What voice adjustments should Ella consider?'
      }),
      buildSegment({
        id: 'keyMessaging',
        label: 'Key Messaging',
        suggestion: joinItems(brandElementsTLDR.sections[2].items),
        chatPrompt: 'Which message should be emphasized or reworked?'
      })
    ]
  }
});

const buildChatThreads = () => ({
  companyContext: [],
  positioning: [],
  customers: [],
  brandElements: []
});

const chatThreadKeyByStep = {
  0: 'companyContext',
  1: 'positioning',
  2: 'customers',
  3: 'brandElements'
};

const FINAL_TLDR_SUGGESTION = 'Would you like me to now revise the TLDR?';

const stepKeyByIndex = {
  1: 'positioning',
  2: 'customers',
  3: 'brandElements'
};

const stepMetaByKey = {
  positioning: {
    title: 'Positioning',
    subtitle: 'Ella researched your positioning and value proposition.',
    chatPrompt: 'What would you like to refine about the Positioning TLDR?'
  },
  customers: {
    title: 'Customers / ICPs',
    subtitle: 'Ella researched your ideal customer profiles.',
    chatPrompt: 'What would you like to refine about the Customers / ICPs TLDR?'
  },
  brandElements: {
    title: 'Brand Ella-ments',
    subtitle: 'Ella researched your brand voice and messaging.',
    chatPrompt: 'What would you like to refine about the Brand Ella-ments TLDR?'
  }
};

const BrandBotSetupModalV2 = ({
  isOpen,
  onClose,
  onComplete,
  persistedStateKey = 'brandbot-builder-state'
}) => {
  const [currentStep, setCurrentStep] = useState(0); // 0: Company Information, 1: Positioning, 2: Customers/ICPs, 3: Brand Ella-ments, 4: Completion
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [entryPath, setEntryPath] = useState(null); // 'positioning' | 'full'
  
  // Step data
  const [companyContext, setCompanyContext] = useState({
    companyName: '',
    websiteUrl: '',
    businessCategory: '',
    location: '',
    description: ''
  });
  const [companyContextFlow, setCompanyContextFlow] = useState(buildCompanyContextFlow);
  
  const [segmentFlow, setSegmentFlow] = useState(buildSegmentFlow);
  const [chatInput, setChatInput] = useState('');
  const [chatThreads, setChatThreads] = useState(buildChatThreads);
  const researchPhaseTimeoutRef = useRef({ planning: null, summary: null });
  const researchCycleRef = useRef(null);
  const companyResearchTimeoutRef = useRef({ planning: null, summary: null });
  const companyResearchCycleRef = useRef(null);
  const chatContentRef = useRef(null);

  // Restore persisted state when modal opens
  useEffect(() => {
    if (isOpen) {
      try {
        // Check entry path from localStorage
        const flow = localStorage.getItem('ella-brandbot-flow');
        const selectedPath = localStorage.getItem('ella-brandbot-selected-path');
        
        if (selectedPath === 'positioning') {
          setEntryPath('positioning');
          setCurrentStep(1); // Start at Positioning
        } else {
          setEntryPath('full');
          setCurrentStep(0); // Start at Company Information
        }
        
        // Restore persisted state
        const raw = localStorage.getItem(persistedStateKey);
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved.currentStep !== undefined) setCurrentStep(saved.currentStep);
          if (saved.companyContext) setCompanyContext(saved.companyContext);
          if (saved.companyContextFlow) setCompanyContextFlow(saved.companyContextFlow);
          if (saved.segmentFlow) {
            const hasStepStatus = saved.segmentFlow.positioning?.status;
            setSegmentFlow(hasStepStatus ? saved.segmentFlow : buildSegmentFlow());
          }
          if (saved.chatThreads) {
            setChatThreads({
              ...buildChatThreads(),
              ...saved.chatThreads
            });
          }
          if (saved.showChatPanel !== undefined) setShowChatPanel(saved.showChatPanel);
          if (saved.entryPath) setEntryPath(saved.entryPath);
        }
      } catch (_) {}
    }
  }, [isOpen, persistedStateKey]);

  useEffect(() => {
    if (currentStep === 0 && showChatPanel && companyContextFlow.status === 'form') {
      setShowChatPanel(false);
    }
  }, [currentStep, showChatPanel, companyContextFlow.status]);

  // Persist state whenever it changes
  const persist = () => {
    try {
      localStorage.setItem(persistedStateKey, JSON.stringify({
        currentStep,
        companyContext,
        companyContextFlow,
        segmentFlow,
        chatThreads,
        showChatPanel,
        entryPath
      }));
    } catch (_) {}
  };

  useEffect(() => {
    if (isOpen) {
      persist();
    }
  }, [currentStep, companyContext, companyContextFlow, segmentFlow, chatThreads, showChatPanel, entryPath, isOpen]);

  // Stepper helper
  const getStepState = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'active';
    return 'inactive';
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    const positioningData = {
      valueProposition: segmentFlow.positioning.segments.find(segment => segment.id === 'valueProposition')?.suggestion || '',
      targetAudience: segmentFlow.positioning.segments.find(segment => segment.id === 'targetAudience')?.suggestion || '',
      brandFeel: segmentFlow.positioning.segments.find(segment => segment.id === 'brandFeel')?.suggestion || '',
      approved: isStepApproved('positioning')
    };

    const customersData = {
      icps: [segmentFlow.customers.segments.find(segment => segment.id === 'icpDetails')?.suggestion || ''].filter(Boolean),
      approved: isStepApproved('customers')
    };

    const brandElementsData = {
      tone: segmentFlow.brandElements.segments.find(segment => segment.id === 'brandTone')?.suggestion || '',
      voice: segmentFlow.brandElements.segments.find(segment => segment.id === 'brandVoice')?.suggestion || '',
      messaging: segmentFlow.brandElements.segments.find(segment => segment.id === 'keyMessaging')?.suggestion || '',
      approved: isStepApproved('brandElements')
    };

    const data = {
      companyContext,
      positioning: positioningData,
      customers: customersData,
      brandElements: brandElementsData,
      segmentFlow,
      entryPath
    };
    
    // Clear persisted state after completion
    try {
      localStorage.removeItem(persistedStateKey);
    } catch (_) {}
    
    onComplete?.(data);
    onClose?.();
  };

  const handleToggleChat = () => {
    if (currentStep === 0 && companyContextFlow.status !== 'chat') return;
    setShowChatPanel(prev => !prev);
  };

  const applyResearchPhase = (segment, phase) => {
    const updatedTasks = segment.researchTasks.map(task => {
      if (phase === 'planning') {
        return task.id === 'planning'
          ? { ...task, status: 'processing' }
          : { ...task, status: 'pending' };
      }
      if (phase === 'finalizing') {
        return { ...task, status: 'completed' };
      }
      return task;
    });

    return {
      ...segment,
      researchPhase: phase,
      researchTasks: updatedTasks
    };
  };

  const clearCompanyResearchTimeouts = () => {
    if (companyResearchTimeoutRef.current.planning) {
      clearTimeout(companyResearchTimeoutRef.current.planning);
    }
    if (companyResearchTimeoutRef.current.summary) {
      clearTimeout(companyResearchTimeoutRef.current.summary);
    }
    companyResearchTimeoutRef.current = { planning: null, summary: null };
  };

  const clearResearchTimeouts = () => {
    if (researchPhaseTimeoutRef.current.planning) {
      clearTimeout(researchPhaseTimeoutRef.current.planning);
    }
    if (researchPhaseTimeoutRef.current.summary) {
      clearTimeout(researchPhaseTimeoutRef.current.summary);
    }
    researchPhaseTimeoutRef.current = { planning: null, summary: null };
  };

  const buildMessageId = (prefix) => (
    `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  );

  const getFollowUpSuggestions = (chatKey) => {
    if (chatKey === 'companyContext') {
      return [
        'Clarify what the company does and for whom',
        'Emphasize the core positioning',
        'Adjust the buyer and manufacturer value'
      ];
    }

    const step = segmentFlow[chatKey];
    if (step?.segments?.length) {
      return step.segments.map(segment => `Refine ${segment.label}`);
    }

    return ['Refine the summary wording'];
  };

  const buildFollowUps = (chatKey) => {
    const baseSuggestions = getFollowUpSuggestions(chatKey);
    const suggestions = [...baseSuggestions, FINAL_TLDR_SUGGESTION];
    return suggestions.map((label, index) => ({
      id: `${chatKey}-followup-${index}`,
      label,
      action: label === FINAL_TLDR_SUGGESTION ? 'revise-tldr' : 'suggestion'
    }));
  };

  const buildEllaMessage = (text, chatKey, includeFollowUps = true) => ({
    id: buildMessageId('ella'),
    sender: 'ella',
    text,
    ...(includeFollowUps ? { followUps: buildFollowUps(chatKey) } : {})
  });

  const appendToChatThread = (chatKey, messages) => {
    setChatThreads(prev => {
      const existing = prev[chatKey] || [];
      return {
        ...prev,
        [chatKey]: [...existing, ...messages]
      };
    });
  };

  const appendUserAndElla = (chatKey, userText, ellaText, includeFollowUps = true) => {
    appendToChatThread(chatKey, [
      { id: buildMessageId('user'), sender: 'user', text: userText },
      buildEllaMessage(ellaText, chatKey, includeFollowUps)
    ]);
  };

  const handleReviseTldr = (chatKey) => {
    if (chatKey === 'companyContext') {
      companyResearchCycleRef.current = null;
      clearCompanyResearchTimeouts();
      setCompanyContextFlow(prev => applyResearchPhase({
        ...prev,
        status: 'researching',
        approved: false,
        researchTasks: buildResearchTasks()
      }, 'planning'));
      return;
    }

    if (!chatKey) return;
    researchCycleRef.current = null;
    clearResearchTimeouts();
    setSegmentFlow(prev => {
      const step = prev[chatKey];
      if (!step) return prev;
      return {
        ...prev,
        [chatKey]: applyResearchPhase(
          {
            ...step,
            status: 'researching',
            approved: false,
            researchTasks: buildResearchTasks()
          },
          'planning'
        )
      };
    });
  };

  const handleChatSend = () => {
    const trimmed = chatInput.trim();
    const stepKey = stepKeyByIndex[currentStep];
    const chatKey = chatThreadKeyByStep[currentStep] || stepKey;
    if (!trimmed) return;
    if (!chatKey) return;

    appendUserAndElla(
      chatKey,
      trimmed,
      'Thanks for that. How would you like me to proceed?'
    );
    setChatInput('');
  };

  const handleFollowUpClick = (followUp) => {
    const stepKey = stepKeyByIndex[currentStep];
    const chatKey = chatThreadKeyByStep[currentStep] || stepKey;
    if (!chatKey) return;

    if (followUp.action === 'revise-tldr') {
      appendUserAndElla(
        chatKey,
        followUp.label,
        'Got it. I will revise the TLDR now.',
        false
      );
      handleReviseTldr(chatKey);
      return;
    }

    appendUserAndElla(
      chatKey,
      followUp.label,
      'Great. How would you like me to proceed?'
    );
  };

  const handleChatKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleChatSend();
    }
  };

  const handleReviseStep = (stepKey) => {
    setSegmentFlow(prev => {
      const step = prev[stepKey];
      if (!step) return prev;
      return {
        ...prev,
        [stepKey]: { ...step, status: 'chat', approved: false }
      };
    });
    setShowChatPanel(true);
  };

  const handleReviseCompanyContext = () => {
    setCompanyContextFlow(prev => ({
      ...prev,
      status: 'chat',
      approved: false
    }));
    setShowChatPanel(true);
  };

  const handleApproveCompanyContext = () => {
    setCompanyContextFlow(prev => ({
      ...prev,
      status: 'summary',
      approved: true
    }));
    setShowChatPanel(false);
  };

  const handleGenerateCompanyContext = () => {
    if (!isCompanyContextComplete()) return;
    companyResearchCycleRef.current = null;
    clearCompanyResearchTimeouts();
    setCompanyContextFlow(prev => applyResearchPhase({
      ...prev,
      status: 'researching',
      approved: false,
      researchTasks: buildResearchTasks()
    }, 'planning'));
    setShowChatPanel(false);
  };

  const handleApproveStep = (stepKey) => {
    setSegmentFlow(prev => {
      const step = prev[stepKey];
      if (!step) return prev;
      return {
        ...prev,
        [stepKey]: {
          ...step,
          approved: true,
          status: 'summary'
        }
      };
    });
    setShowChatPanel(false);
  };

  if (!isOpen) return null;

  const steps = [
    { id: 'company-context', label: 'Company Context' },
    { id: 'positioning', label: 'Positioning' },
    { id: 'customers', label: 'Customers / ICPs' },
    { id: 'brand-elements', label: 'Brand Ella-ments' },
    { id: 'completion', label: 'Completion' }
  ];

  const currentStepKey = stepKeyByIndex[currentStep];
  const currentStepFlow = currentStepKey ? segmentFlow[currentStepKey] : null;
  const chatAllowed = currentStep !== 0 || companyContextFlow.status !== 'form';
  const chatVisible = chatAllowed && showChatPanel;
  const activeChatKey = chatThreadKeyByStep[currentStep] || currentStepKey;
  const activeChatMessages = activeChatKey ? (chatThreads[activeChatKey] || []) : [];

  useEffect(() => {
    if (!activeChatKey) return;
    const shouldSeed = currentStep === 0
      ? companyContextFlow.status === 'chat'
      : currentStepFlow?.status === 'chat';
    if (!shouldSeed) return;

    setChatThreads(prev => {
      const existing = prev[activeChatKey] || [];
      if (existing.length) return prev;
      const prompt = currentStep === 0
        ? 'What would you like to refine about the Company Context?'
        : stepMetaByKey[currentStepKey]?.chatPrompt || 'What would you like to refine?';
      return {
        ...prev,
        [activeChatKey]: [buildEllaMessage(prompt, activeChatKey, false)]
      };
    });
  }, [activeChatKey, currentStep, currentStepKey, currentStepFlow?.status, companyContextFlow.status]);

  useEffect(() => {
    setChatInput('');
  }, [activeChatKey]);

  useEffect(() => {
    if (!chatVisible) return;
    const container = chatContentRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [chatVisible, activeChatKey, activeChatMessages.length]);

  useEffect(() => {
    if (companyContextFlow.status !== 'researching') {
      companyResearchCycleRef.current = null;
      clearCompanyResearchTimeouts();
      return;
    }

    if (companyResearchCycleRef.current === 'company-context') return;
    companyResearchCycleRef.current = 'company-context';
    clearCompanyResearchTimeouts();

    setCompanyContextFlow(prev => applyResearchPhase(prev, 'planning'));

    companyResearchTimeoutRef.current.planning = setTimeout(() => {
      setCompanyContextFlow(prev => applyResearchPhase(prev, 'finalizing'));
    }, 10000);

    companyResearchTimeoutRef.current.summary = setTimeout(() => {
      setCompanyContextFlow(prev => ({
        ...prev,
        status: 'summary'
      }));
    }, 15000);

    return () => clearCompanyResearchTimeouts();
  }, [companyContextFlow.status]);

  useEffect(() => {
    if (!currentStepKey || !currentStepFlow || currentStepFlow.status !== 'researching') {
      researchCycleRef.current = null;
      clearResearchTimeouts();
      return;
    }

    if (researchCycleRef.current === currentStepKey) return;
    researchCycleRef.current = currentStepKey;
    clearResearchTimeouts();

    setSegmentFlow(prev => {
      const step = prev[currentStepKey];
      if (!step) return prev;
      return {
        ...prev,
        [currentStepKey]: applyResearchPhase(step, 'planning')
      };
    });

    researchPhaseTimeoutRef.current.planning = setTimeout(() => {
      setSegmentFlow(prev => {
        const step = prev[currentStepKey];
        if (!step) return prev;
        return {
          ...prev,
          [currentStepKey]: applyResearchPhase(step, 'finalizing')
        };
      });
    }, 10000);

    researchPhaseTimeoutRef.current.summary = setTimeout(() => {
      setSegmentFlow(prev => {
        const step = prev[currentStepKey];
        if (!step) return prev;
        return {
          ...prev,
          [currentStepKey]: { ...step, status: 'summary' }
        };
      });
    }, 15000);

    return () => clearResearchTimeouts();
  }, [currentStepKey, currentStepFlow?.status]);

  useEffect(() => {
    return () => clearResearchTimeouts();
  }, []);

  useEffect(() => {
    return () => clearCompanyResearchTimeouts();
  }, []);

  const isStepApproved = (stepKey) => (
    segmentFlow[stepKey].approved
  );

  const isCompanyContextComplete = () => (
    Boolean(companyContext.companyName.trim()) &&
    Boolean(companyContext.websiteUrl.trim()) &&
    Boolean(companyContext.businessCategory.trim()) &&
    Boolean(companyContext.location.trim()) &&
    Boolean(companyContext.description.trim())
  );

  const canProceedToNext = () => {
    if (currentStep === 0) return companyContextFlow.approved;
    if (currentStepKey) return isStepApproved(currentStepKey);
    return true;
  };

  const isCelebrationStep = currentStep === 1 && entryPath === 'positioning' && isStepApproved('positioning');
  const showCelebration = isCelebrationStep;
  const canProceedNext = canProceedToNext();

  const getVisibleResearchTask = (segment) => {
    if (!segment?.researchTasks?.length) return null;
    const phase = segment.researchPhase === 'finalizing' ? 'finalizing' : 'planning';
    return segment.researchTasks.find(task => task.id === phase) || segment.researchTasks[0];
  };

  const renderSegmentStep = (stepKey) => {
    const stepMeta = stepMetaByKey[stepKey];
    const stepData = segmentFlow[stepKey];
    const stepApproved = isStepApproved(stepKey);
    const tldr = tldrByStep[stepKey];

    return (
      <div className="brandbot-builder-modal__step">
        <p className="brandbot-builder-modal__step-subtitle">{stepMeta.subtitle}</p>

        <div className="brandbot-builder-modal__segment-card">
          <div className="brandbot-builder-modal__segment-card-header">
            <div className="brandbot-builder-modal__segment-card-title">{stepMeta.title}</div>
            {stepData.approved ? (
              <span className="brandbot-builder-modal__segment-status brandbot-builder-modal__segment-status--approved">Approved</span>
            ) : stepData.status === 'researching' ? (
              <span className="brandbot-builder-modal__segment-status brandbot-builder-modal__segment-status--researching">Researching</span>
            ) : (
              <span className="brandbot-builder-modal__segment-status brandbot-builder-modal__segment-status--summary">Summary Ready</span>
            )}
          </div>

          {stepData.status === 'researching' ? (
            <div className="brandbot-builder-modal__segment-research">
              <div className="brandbot-builder-modal__segment-research-title">
                Ella is researching {stepMeta.title}.
              </div>
              <div className="brandbot-builder-modal__segment-research-tasks">
                {(() => {
                  const researchTask = getVisibleResearchTask(stepData);
                  if (!researchTask) return null;
                  return (
                    <div
                      key={researchTask.id}
                      className={`brandbot-builder-modal__segment-research-task brandbot-builder-modal__segment-research-task--${researchTask.status}`}
                    >
                      <span className="brandbot-builder-modal__segment-research-indicator">
                        {researchTask.status === 'completed' ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="m9 12 2 2 4-4"></path>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="brandbot-builder-modal__segment-spinner">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                          </svg>
                        )}
                      </span>
                      <span className="brandbot-builder-modal__segment-research-text">{researchTask.label}</span>
                    </div>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className="brandbot-builder-modal__segment-summary">
              <div className="brandbot-builder-modal__segment-summary-header">
                <div className="brandbot-builder-modal__segment-summary-title">
                  {tldr.title}
                </div>
                {stepData.approved ? (
                  <div className="brandbot-builder-modal__segment-summary-pill">approved</div>
                ) : (
                  <div className="brandbot-builder-modal__segment-summary-pill">ready</div>
                )}
              </div>
              <div className="brandbot-builder-modal__segment-summary-body">
                <p className="brandbot-builder-modal__segment-summary-subtitle">{tldr.subtitle}</p>
                <p className="brandbot-builder-modal__segment-summary-description">{tldr.description}</p>
                <div className="brandbot-builder-modal__segment-summary-sections">
                  {tldr.sections.map((section, sectionIndex) => (
                    <div key={`${section.title}-${sectionIndex}`} className="brandbot-builder-modal__segment-summary-section">
                      <div className="brandbot-builder-modal__segment-summary-section-title">{section.title}</div>
                      <ul className="brandbot-builder-modal__segment-summary-list">
                        {section.items.map((item, itemIndex) => (
                          <li key={`${section.title}-${itemIndex}`} className="brandbot-builder-modal__segment-summary-item">{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              {stepData.status === 'chat' && (
                <div className="brandbot-builder-modal__segment-chat-note">
                  Ella is waiting for your feedback in chat.
                </div>
              )}
              {!stepData.approved && (
                <div className="brandbot-builder-modal__segment-actions">
                  <button
                    type="button"
                    className="brandbot-builder-modal__btn brandbot-builder-modal__btn--primary"
                    onClick={() => handleApproveStep(stepKey)}
                  >
                    Approve & Continue
                  </button>
                  <button
                    type="button"
                    className="brandbot-builder-modal__btn brandbot-builder-modal__btn--secondary"
                    onClick={() => handleReviseStep(stepKey)}
                  >
                    Revise with Ella
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {stepApproved && (
          <div className="brandbot-builder-modal__segment-complete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
            <span>TLDR approved for this step.</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div className="brandbot-builder-modal__backdrop" onClick={onClose} />
      
      {/* Modal */}
      <div className="brandbot-builder-modal">
        {/* Header */}
        <div className="brandbot-builder-modal__header">
          <div className="brandbot-builder-modal__header-content">
            <div className="brandbot-builder-modal__title-section">
              <svg className="brandbot-builder-modal__sparkle-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                <path d="M20 2v4"></path>
                <path d="M22 4h-4"></path>
                <circle cx="4" cy="20" r="2"></circle>
              </svg>
              <span className="brandbot-builder-modal__title">Brand Bot Builder</span>
            </div>
            <div className="brandbot-builder-modal__header-actions">
              {/* Chat Toggle */}
              {chatAllowed && (
                <button 
                  className={`brandbot-builder-modal__chat-toggle ${chatVisible ? 'brandbot-builder-modal__chat-toggle--active' : ''}`}
                  onClick={handleToggleChat}
                  title={chatVisible ? 'Hide chat' : 'Show chat'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </button>
              )}
              <button className="brandbot-builder-modal__close" onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Stepper */}
          <div className="brandbot-builder-modal__stepper">
            {steps.map((step, index) => {
              const state = getStepState(index);
              return (
                <React.Fragment key={step.id}>
                  <div className={`brandbot-builder-modal__stepper-item brandbot-builder-modal__stepper-item--${state}`}>
                    <div className="brandbot-builder-modal__stepper-indicator">
                      {state === 'completed' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <span className="brandbot-builder-modal__stepper-label">{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`brandbot-builder-modal__stepper-separator brandbot-builder-modal__stepper-separator--${state === 'completed' ? 'completed' : state === 'active' ? 'active' : 'inactive'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content - Split Layout */}
        <div className={`brandbot-builder-modal__content-wrapper ${chatVisible ? 'brandbot-builder-modal__content-wrapper--with-chat' : 'brandbot-builder-modal__content-wrapper--no-chat'}`}>
          {/* Main Content */}
          <div className="brandbot-builder-modal__content">
            {currentStep === 0 && (
              <div className="brandbot-builder-modal__step">
                <p className="brandbot-builder-modal__step-subtitle">
                  Here is the company context Ella researched for you.
                </p>

                {companyContextFlow.status === 'form' && (
                  <>
                    <div className="brandbot-builder-modal__form-group">
                      <label className="brandbot-builder-modal__label">Company Name</label>
                      <input
                        type="text"
                        className="brandbot-builder-modal__input"
                        placeholder="Enter your company name"
                        value={companyContext.companyName}
                        onChange={(e) => setCompanyContext(prev => ({ ...prev, companyName: e.target.value }))}
                      />
                    </div>

                    <div className="brandbot-builder-modal__form-group">
                      <label className="brandbot-builder-modal__label">Website URL</label>
                      <input
                        type="url"
                        className="brandbot-builder-modal__input"
                        placeholder="https://example.com"
                        value={companyContext.websiteUrl}
                        onChange={(e) => setCompanyContext(prev => ({ ...prev, websiteUrl: e.target.value }))}
                      />
                    </div>

                    <div className="brandbot-builder-modal__form-row">
                      <div className="brandbot-builder-modal__form-group">
                        <label className="brandbot-builder-modal__label">Business Category</label>
                        <input
                          type="text"
                          className="brandbot-builder-modal__input"
                          placeholder="e.g., fintech, e-commerce"
                          value={companyContext.businessCategory}
                          onChange={(e) => setCompanyContext(prev => ({ ...prev, businessCategory: e.target.value }))}
                        />
                      </div>
                      <div className="brandbot-builder-modal__form-group">
                        <label className="brandbot-builder-modal__label">Location</label>
                        <input
                          type="text"
                          className="brandbot-builder-modal__input"
                          placeholder="e.g., New York, London"
                          value={companyContext.location}
                          onChange={(e) => setCompanyContext(prev => ({ ...prev, location: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="brandbot-builder-modal__form-group">
                      <label className="brandbot-builder-modal__label">Company Description</label>
                      <textarea
                        className="brandbot-builder-modal__textarea"
                        placeholder="Describe what your company does..."
                        value={companyContext.description}
                        onChange={(e) => setCompanyContext(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                      />
                    </div>
                  </>
                )}

                {companyContextFlow.status === 'researching' && (
                  <div className="brandbot-builder-modal__segment-card">
                    <div className="brandbot-builder-modal__segment-card-header">
                      <div className="brandbot-builder-modal__segment-card-title">Company Context</div>
                      <span className="brandbot-builder-modal__segment-status brandbot-builder-modal__segment-status--researching">Researching</span>
                    </div>
                    <div className="brandbot-builder-modal__segment-research">
                      <div className="brandbot-builder-modal__segment-research-title">
                        Ella is researching Company Context.
                      </div>
                      <div className="brandbot-builder-modal__segment-research-tasks">
                        {(() => {
                          const researchTask = getVisibleResearchTask(companyContextFlow);
                          if (!researchTask) return null;
                          return (
                            <div
                              key={researchTask.id}
                              className={`brandbot-builder-modal__segment-research-task brandbot-builder-modal__segment-research-task--${researchTask.status}`}
                            >
                              <span className="brandbot-builder-modal__segment-research-indicator">
                                {researchTask.status === 'completed' ? (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="m9 12 2 2 4-4"></path>
                                  </svg>
                                ) : (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="brandbot-builder-modal__segment-spinner">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                                  </svg>
                                )}
                              </span>
                              <span className="brandbot-builder-modal__segment-research-text">{researchTask.label}</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {(companyContextFlow.status === 'summary' || companyContextFlow.status === 'chat') && (
                  <div className="brandbot-builder-modal__segment-card">
                    <div className="brandbot-builder-modal__segment-card-header">
                      <div className="brandbot-builder-modal__segment-card-title">Company Context</div>
                      {companyContextFlow.approved ? (
                        <span className="brandbot-builder-modal__segment-status brandbot-builder-modal__segment-status--approved">Approved</span>
                      ) : (
                        <span className="brandbot-builder-modal__segment-status brandbot-builder-modal__segment-status--summary">Summary Ready</span>
                      )}
                    </div>
                    <div className="brandbot-builder-modal__segment-summary brandbot-builder-modal__segment-summary--company-context">
                      <div className="brandbot-builder-modal__segment-summary-header">
                        <div className="brandbot-builder-modal__segment-summary-title">{companyContextTLDR.title}</div>
                        {companyContextFlow.approved ? (
                          <div className="brandbot-builder-modal__segment-summary-pill">approved</div>
                        ) : (
                          <div className="brandbot-builder-modal__segment-summary-pill">ready</div>
                        )}
                      </div>
                      <div className="brandbot-builder-modal__segment-summary-body">
                        <p className="brandbot-builder-modal__segment-summary-subtitle">{companyContextTLDR.subtitle}</p>
                        <p className="brandbot-builder-modal__segment-summary-description">{companyContextTLDR.description}</p>
                        <div className="brandbot-builder-modal__segment-summary-sections brandbot-builder-modal__segment-summary-sections--company-context">
                          {companyContextTLDR.sections.map((section, sectionIndex) => {
                            const isList = section.items.length > 1;
                            return (
                              <div
                                key={`${section.title}-${sectionIndex}`}
                                className={`brandbot-builder-modal__segment-summary-section ${isList
                                  ? 'brandbot-builder-modal__segment-summary-section--list'
                                  : 'brandbot-builder-modal__segment-summary-section--line'
                                }`}
                              >
                                {isList ? (
                                  <>
                                    <div className="brandbot-builder-modal__segment-summary-section-title brandbot-builder-modal__segment-summary-section-title--company-context">
                                      {section.title}
                                    </div>
                                    <ul className="brandbot-builder-modal__segment-summary-list brandbot-builder-modal__segment-summary-list--compact">
                                      {section.items.map((item, itemIndex) => (
                                        <li key={`${section.title}-${itemIndex}`} className="brandbot-builder-modal__segment-summary-item">{item}</li>
                                      ))}
                                    </ul>
                                  </>
                                ) : (
                                  <div className="brandbot-builder-modal__segment-summary-line">
                                    <span className="brandbot-builder-modal__segment-summary-line-title">{section.title}</span>
                                    <span className="brandbot-builder-modal__segment-summary-line-separator"> - </span>
                                    <span className="brandbot-builder-modal__segment-summary-line-text">{section.items[0] || ''}</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {companyContextFlow.status === 'chat' && (
                        <div className="brandbot-builder-modal__segment-chat-note">
                          Ella is waiting for your feedback in chat.
                        </div>
                      )}
                      {!companyContextFlow.approved && (
                        <div className="brandbot-builder-modal__segment-actions">
                          <button
                            type="button"
                            className="brandbot-builder-modal__btn brandbot-builder-modal__btn--primary"
                            onClick={handleApproveCompanyContext}
                          >
                            Approve & Continue
                          </button>
                          <button
                            type="button"
                            className="brandbot-builder-modal__btn brandbot-builder-modal__btn--secondary"
                            onClick={handleReviseCompanyContext}
                          >
                            Revise with Ella
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 1 && (
              showCelebration ? (
                <div className="brandbot-builder-modal__step">
                  <div className="brandbot-builder-modal__celebration">
                    <div className="brandbot-builder-modal__celebration-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                      </svg>
                    </div>
                    <h2 className="brandbot-builder-modal__celebration-title">You've completed the first step of your Brand Bot.</h2>
                    <p className="brandbot-builder-modal__celebration-text">
                      Great work! You've finished your positioning. Would you like to continue building your Brand Bot now, or come back later?
                    </p>
                    <div className="brandbot-builder-modal__celebration-actions">
                      <button
                        className="brandbot-builder-modal__btn brandbot-builder-modal__btn--primary"
                        onClick={handleNext}
                      >
                        Continue building Brand Bot
                      </button>
                      <button
                        className="brandbot-builder-modal__btn brandbot-builder-modal__btn--secondary"
                        onClick={onClose}
                      >
                        Come back later
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                renderSegmentStep('positioning')
              )
            )}

            {currentStep === 2 && (
              renderSegmentStep('customers')
            )}

            {currentStep === 3 && (
              renderSegmentStep('brandElements')
            )}

            {currentStep === 4 && (
              <div className="brandbot-builder-modal__step">
                <h2 className="brandbot-builder-modal__step-title">Completion</h2>
                <p className="brandbot-builder-modal__step-subtitle">
                  Review your Brand Bot summary and complete the setup.
                </p>
                
                <div className="brandbot-builder-modal__summary">
                  <div className="brandbot-builder-modal__summary-section">
                    <h3>Company Information</h3>
                    <p>{companyContext.companyName || 'Not provided'}</p>
                  </div>
                  <div className="brandbot-builder-modal__summary-section">
                    <h3>Positioning</h3>
                    <ul>
                      {segmentFlow.positioning.segments.map(segment => (
                        <li key={segment.id}>
                          <strong>{segment.label}:</strong> {segment.suggestion || 'Not provided'}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="brandbot-builder-modal__summary-section">
                    <h3>Customers / ICPs</h3>
                    <ul>
                      {segmentFlow.customers.segments.map(segment => (
                        <li key={segment.id}>
                          <strong>{segment.label}:</strong> {segment.suggestion || 'Not provided'}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="brandbot-builder-modal__summary-section">
                    <h3>Brand Ella-ments</h3>
                    <ul>
                      {segmentFlow.brandElements.segments.map(segment => (
                        <li key={segment.id}>
                          <strong>{segment.label}:</strong> {segment.suggestion || 'Not provided'}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Panel */}
          <div
            className={`brandbot-builder-modal__chat-panel ${chatVisible ? 'brandbot-builder-modal__chat-panel--visible' : 'brandbot-builder-modal__chat-panel--hidden'}`}
            aria-hidden={!chatVisible}
          >
              <div className="brandbot-builder-modal__chat-header">
                <div className="brandbot-builder-modal__ella-avatar">
                  <span>E</span>
                </div>
                <div className="brandbot-builder-modal__ella-info">
                  <div className="brandbot-builder-modal__ella-name">Ella:</div>
                  <div className="brandbot-builder-modal__ella-status">Online</div>
                </div>
              </div>

              <div className="brandbot-builder-modal__chat-content" ref={chatContentRef}>
                {activeChatMessages.length > 0 ? (
                  activeChatMessages.map(message => (
                    <div
                      key={message.id}
                      className={`brandbot-builder-modal__chat-message brandbot-builder-modal__chat-message--${message.sender}`}
                    >
                      <p>{message.text}</p>
                      {message.followUps?.length > 0 && (
                        <div className="brandbot-builder-modal__chat-followups">
                          <div className="brandbot-builder-modal__chat-followups-title">
                            How would you like me to proceed?
                          </div>
                          <div className="brandbot-builder-modal__chat-followups-list">
                            {message.followUps.map(followUp => (
                              <button
                                key={followUp.id}
                                type="button"
                                className="brandbot-builder-modal__chat-followup"
                                onClick={() => handleFollowUpClick(followUp)}
                              >
                                {followUp.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="brandbot-builder-modal__chat-message brandbot-builder-modal__chat-message--ella">
                    <p>
                      {currentStepFlow?.status === 'chat'
                        ? stepMetaByKey[currentStepKey]?.chatPrompt
                        : 'I am here to help you refine your Brand Bot. What would you like to adjust?'}
                    </p>
                  </div>
                )}
              </div>

              <div className="brandbot-builder-modal__chat-input">
                <input 
                  type="text" 
                  placeholder="Type your message to Ella..."
                  className="brandbot-builder-modal__chat-input-field"
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  onKeyDown={handleChatKeyDown}
                />
                <button
                  className="brandbot-builder-modal__chat-send"
                  type="button"
                  onClick={handleChatSend}
                  disabled={!chatInput.trim()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                    <path d="M17.7818 0.607503C17.782 0.596637 17.782 0.586165 17.7818 0.575298C17.7811 0.548823 17.7785 0.522742 17.7743 0.496662C17.773 0.488561 17.7726 0.480658 17.7708 0.472558C17.7641 0.439957 17.7546 0.407949 17.7423 0.37693C17.7388 0.367841 17.7342 0.359345 17.7303 0.350454C17.7198 0.326942 17.708 0.304221 17.6943 0.282092C17.6888 0.273004 17.6833 0.263915 17.6771 0.254826C17.657 0.225782 17.6352 0.197924 17.6098 0.172436C17.5841 0.146751 17.5558 0.12482 17.5266 0.104469C17.5183 0.0987397 17.5098 0.093405 17.5011 0.088268C17.4778 0.0738448 17.4539 0.0613974 17.4292 0.0505306C17.4215 0.0471718 17.4142 0.0432202 17.4062 0.040059C17.3744 0.0276115 17.3416 0.0177326 17.3081 0.011015C17.3019 0.0098295 17.2956 0.00943434 17.2895 0.00824887C17.2614 0.003507 17.2332 0.000740905 17.2047 0.00014817C17.1952 -4.93926e-05 17.1859 -4.93926e-05 17.1767 0.000148186C17.1488 0.00074092 17.1209 0.00350701 17.0931 0.00824889C17.0862 0.00943436 17.0795 0.00982952 17.0725 0.0112126C17.0421 0.0173375 17.0121 0.0256358 16.9824 0.0367001L0.384498 6.26496C0.16242 6.34833 0.0114701 6.55599 0.00060336 6.79308C-0.0100659 7.02998 0.121521 7.25067 0.335103 7.35381L7.14266 10.6391L10.4278 17.4467C10.5272 17.6524 10.7352 17.782 10.9618 17.782C10.9709 17.782 10.9798 17.7818 10.9889 17.7814C11.2258 17.7705 11.4337 17.6196 11.517 17.3975L17.7455 0.799747C17.7566 0.770308 17.7647 0.740473 17.7708 0.710244C17.7724 0.702143 17.773 0.69424 17.7741 0.686139C17.7785 0.660059 17.7811 0.633781 17.7818 0.607503ZM14.8354 2.1085L7.4655 9.47837L2.09809 6.88831L14.8354 2.1085ZM10.8937 15.6839L8.30363 10.3167L15.6737 2.94663L10.8937 15.6839Z" fillRule="nonzero" transform="matrix(1 0 0 1 0.098877 0.0989456)" fill="currentColor"/>
                  </svg>
                </button>
              </div>
          </div>
        </div>

        {/* Footer */}
        <div className="brandbot-builder-modal__footer">
          <button
            type="button"
            className="brandbot-builder-modal__btn brandbot-builder-modal__btn--secondary"
            onClick={currentStep === 0 ? onClose : handleBack}
          >
            {currentStep === 0 ? 'Exit' : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 19-7-7 7-7"></path>
                  <path d="M19 12H5"></path>
                </svg>
                Back
              </>
            )}
          </button>

          {currentStep < 4 && !showCelebration && (
          currentStep === 0 ? (
            <button
              type="button"
              className="brandbot-builder-modal__btn brandbot-builder-modal__btn--primary"
              onClick={companyContextFlow.status === 'form' ? handleGenerateCompanyContext : handleNext}
              disabled={companyContextFlow.status === 'form' ? !isCompanyContextComplete() : !companyContextFlow.approved}
            >
              {companyContextFlow.status === 'form' ? 'Generate Company Context' : 'Next'}
              {companyContextFlow.status !== 'form' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              )}
            </button>
          ) : (
            <button
              type="button"
              className="brandbot-builder-modal__btn brandbot-builder-modal__btn--primary"
              onClick={handleNext}
              disabled={!canProceedNext}
            >
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          )
          )}

          {currentStep === 4 && (
            <button
              type="button"
              className="brandbot-builder-modal__btn brandbot-builder-modal__btn--primary"
              onClick={handleComplete}
            >
              Complete Brand Bot
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default BrandBotSetupModalV2;
