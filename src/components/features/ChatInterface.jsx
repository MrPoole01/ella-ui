import React, { useState, useEffect, useRef } from 'react';
import '../../styles/ChatInterface.scss';

const ChatInterface = ({ selectedProject, onOpenTemplateDrawer, externalPrompt }) => {
  const [inputValue, setInputValue] = useState('');
  const [showPlanningAssets, setShowPlanningAssets] = useState(false);
  const [showMarketingAssets, setShowMarketingAssets] = useState(false);
  const [showStrategyDocuments, setShowStrategyDocuments] = useState(false);
  
  // Mic menu states
  const [showMicMenu, setShowMicMenu] = useState(false);
  const [micMenuLevel, setMicMenuLevel] = useState(1); // 1: main, 2: projects, 3: export

  const planningAssets = [
    "I need to plan a marketing roadmap for the next quarter to align with business objectives",
    "I need to plan a framework for a retargeting campaign", 
    "Let's create a content strategy to nurture leads and drive engagement",
    "I need to develop a lead generation playbook",
    "I need to research relevant keywords and build a content calendar",
    "I need a sales playbook",
    "I need to draft a messaging framework for different regions or markets",
    "I need to create an internal guide for brand messaging and tone"
  ];

  // Create compact mini-card data from planning asset text
  const deriveMiniCard = (text) => {
    const lower = text.toLowerCase();
    let title = 'Planning Asset';
    const tags = [];
    if (lower.includes('roadmap')) { title = 'Marketing Roadmap'; tags.push('Planning'); }
    else if (lower.includes('retarget')) { title = 'Retargeting Plan'; tags.push('Campaign'); }
    else if (lower.includes('content strategy')) { title = 'Content Strategy'; tags.push('Content'); }
    else if (lower.includes('lead generation') || lower.includes('lead gen')) { title = 'Lead Gen Playbook'; tags.push('Growth'); }
    else if (lower.includes('keywords') || lower.includes('seo')) { title = 'SEO Research'; tags.push('SEO'); }
    else if (lower.includes('sales playbook')) { title = 'Sales Playbook'; tags.push('Sales'); }
    else if (lower.includes('messaging')) { title = 'Messaging Framework'; tags.push('Brand'); }
    else if (lower.includes('internal guide') || lower.includes('brand messaging')) { title = 'Brand Guide'; tags.push('Brand'); }
    else if (lower.includes('webinar')) { title = 'Webinar Plan'; tags.push('Events'); }
    else if (lower.includes('nurture')) { title = 'Nurture Sequence'; tags.push('Email'); }
    else if (lower.includes('announcement email')) { title = 'Announcement Email'; tags.push('Email'); }
    else if (lower.includes('optimize our website')) { title = 'Website Optimization'; tags.push('CRO'); }
    else if (lower.includes('linkedin')) { title = 'LinkedIn Post'; tags.push('Social'); }
    else if (lower.includes('customer success story')) { title = 'Case Study'; tags.push('Content'); }
    else if (lower.includes('content calendar')) { title = 'Content Calendar'; tags.push('Content'); }
    // Strategy document mappings
    if (lower.includes('market condition') || lower.includes('market conditions') || lower.includes('market')) {
      if (!tags.includes('Strategy')) tags.push('Strategy');
      if (!tags.includes('Market')) tags.push('Market');
      if (!lower.includes('market') && title === 'Planning Asset') title = 'Market Conditions';
    }
    if (lower.includes('competitive')) {
      if (!tags.includes('Strategy')) tags.push('Strategy');
      if (!tags.includes('Analysis')) tags.push('Analysis');
      if (title === 'Planning Asset') title = 'Competitive Analysis';
    }
    if (lower.includes('persona') || lower.includes('icp')) {
      if (!tags.includes('Strategy')) tags.push('Strategy');
      if (!tags.includes('Persona')) tags.push('Persona');
      if (title === 'Planning Asset') title = 'Persona / ICP';
    }
    if (lower.includes('value proposition')) {
      if (!tags.includes('Strategy')) tags.push('Strategy');
      if (!tags.includes('Brand')) tags.push('Brand');
      if (title === 'Planning Asset') title = 'Value Proposition';
    }
    if (lower.includes('message guide') || lower.includes('message')) {
      if (!tags.includes('Strategy')) tags.push('Strategy');
      if (!tags.includes('Brand')) tags.push('Brand');
      if (title === 'Planning Asset') title = 'Message Guide';
    }
    if (lower.includes('customer journey') || lower.includes('journey')) {
      if (!tags.includes('Strategy')) tags.push('Strategy');
      if (!tags.includes('Journey')) tags.push('Journey');
      if (title === 'Planning Asset') title = 'Customer Journey Map';
    }
    if (lower.includes('moments')) {
      if (!tags.includes('Strategy')) tags.push('Strategy');
      if (!tags.includes('Moments')) tags.push('Moments');
      if (title === 'Planning Asset') title = 'Moments Framework';
    }
    if (lower.includes('brand identity') || lower.includes('identity')) {
      if (!tags.includes('Strategy')) tags.push('Strategy');
      if (!tags.includes('Brand')) tags.push('Brand');
      if (title === 'Planning Asset') title = 'Brand Identity';
    }
    if (lower.includes('pestle') || lower.includes('zeitgeist') || lower.includes('headwinds') || lower.includes('tailwinds')) {
      if (!tags.includes('Strategy')) tags.push('Strategy');
      if (!tags.includes('Analysis')) tags.push('Analysis');
      if (title === 'Planning Asset') title = 'Macro Analysis';
    }
    // Default tag for strategy-type items
    if (tags.length === 0) {
      tags.push('Strategy');
    }
    return { title, tags };
  };

  const MiniCardTags = ({ tags }) => {
    const display = Array.isArray(tags) ? tags.slice(0, 2) : [];
    const showMore = Array.isArray(tags) && tags.length > 2;
    return (
      <div className="chat-interface__mini-card-tags">
        {display.map((tag) => (
          <span key={tag} className="chat-interface__mini-card-tag">{tag}</span>
        ))}
        {showMore && <span className="chat-interface__mini-card-tag-more">+</span>}
      </div>
    );
  };

  const marketingAssets = [
    "I need to brainstorm topics for a content calendar",
    "I need to write a high-performing social media post",
    "I need to write a customer success story to share with potential buyers",
    "I need to write a personal LinkedIn post that builds my thought leadership",
    "I need to optimize our website for conversions",
    "I need to write an announcement email for a new feature or product",
    "I need to craft a nurture email sequence",
    "I need to plan a webinar for my audience"
  ];

  const strategyDocuments = [
    "Then, identify the Market Conditions",
    "Then, create a Competitive Analysis",
    "Then, build a Persona / Ideal Customer Profile",
    "For each Persona, define a Value Proposition",
    "For each Persona, build a Message Guide",
    "For each Persona, outline a Customer Journey Map or Moments Framework",
    "Define possible Moments for Marketing",
    "Define the Brand Identity"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      console.log('Sending message:', inputValue);
      setInputValue('');
      setShowPlanningAssets(false);
      setShowMarketingAssets(false);
      setShowStrategyDocuments(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Check if user is typing "planning assets", "marketing assets", or "strategy documents" intelligently
    const lowerValue = value.toLowerCase().trim();
    const hasProjectContent = selectedProject && document.querySelector('.chat-interface__project-content');
    
    // Progressive matching for "planning assets"
    const planningTarget = "planning assets";
    const isTypingPlanningAssets = 
      lowerValue.includes("plan") ||
      lowerValue.includes("planning") ||
      lowerValue.includes("planning a") ||
      lowerValue.includes("planning as") ||
      lowerValue.includes("planning ass") ||
      lowerValue.includes("planning asse") ||
      lowerValue.includes("planning asset") ||
      lowerValue.includes("planning assets") ||
      // Also check if they're typing it at the end of a sentence
      lowerValue.endsWith("plan") ||
      lowerValue.endsWith("planning") ||
      lowerValue.endsWith("planning a") ||
      lowerValue.endsWith("planning as") ||
      lowerValue.endsWith("planning ass") ||
      lowerValue.endsWith("planning asse") ||
      lowerValue.endsWith("planning asset") ||
      lowerValue.endsWith("planning assets") ||
      // Check for partial matches with some flexibility
      isPartialMatch(lowerValue, planningTarget);

    // Progressive matching for "marketing assets"
    const marketingTarget = "marketing assets";
    const isTypingMarketingAssets = 
      lowerValue.includes("mark") ||
      lowerValue.includes("market") ||
      lowerValue.includes("marketi") ||
      lowerValue.includes("marketin") ||
      lowerValue.includes("marketing") ||
      lowerValue.includes("marketing a") ||
      lowerValue.includes("marketing as") ||
      lowerValue.includes("marketing ass") ||
      lowerValue.includes("marketing asse") ||
      lowerValue.includes("marketing asset") ||
      lowerValue.includes("marketing assets") ||
      // Also check if they're typing it at the end of a sentence
      lowerValue.endsWith("mark") ||
      lowerValue.endsWith("market") ||
      lowerValue.endsWith("marketi") ||
      lowerValue.endsWith("marketin") ||
      lowerValue.endsWith("marketing") ||
      lowerValue.endsWith("marketing a") ||
      lowerValue.endsWith("marketing as") ||
      lowerValue.endsWith("marketing ass") ||
      lowerValue.endsWith("marketing asse") ||
      lowerValue.endsWith("marketing asset") ||
      lowerValue.endsWith("marketing assets") ||
      // Check for partial matches with some flexibility
      isPartialMatch(lowerValue, marketingTarget);

    // Progressive matching for "strategy documents"
    const strategyTarget = "strategy documents";
    const isTypingStrategyDocuments = 
      lowerValue.includes("strat") ||
      lowerValue.includes("strate") ||
      lowerValue.includes("strateg") ||
      lowerValue.includes("strategy") ||
      lowerValue.includes("strategy d") ||
      lowerValue.includes("strategy do") ||
      lowerValue.includes("strategy doc") ||
      lowerValue.includes("strategy docu") ||
      lowerValue.includes("strategy docum") ||
      lowerValue.includes("strategy docume") ||
      lowerValue.includes("strategy documen") ||
      lowerValue.includes("strategy document") ||
      lowerValue.includes("strategy documents") ||
      // Also check if they're typing it at the end of a sentence
      lowerValue.endsWith("strat") ||
      lowerValue.endsWith("strate") ||
      lowerValue.endsWith("strateg") ||
      lowerValue.endsWith("strategy") ||
      lowerValue.endsWith("strategy d") ||
      lowerValue.endsWith("strategy do") ||
      lowerValue.endsWith("strategy doc") ||
      lowerValue.endsWith("strategy docu") ||
      lowerValue.endsWith("strategy docum") ||
      lowerValue.endsWith("strategy docume") ||
      lowerValue.endsWith("strategy documen") ||
      lowerValue.endsWith("strategy document") ||
      lowerValue.endsWith("strategy documents") ||
      // Check for partial matches with some flexibility
      isPartialMatch(lowerValue, strategyTarget);
    
    setShowPlanningAssets(isTypingPlanningAssets && !hasProjectContent);
    setShowMarketingAssets(isTypingMarketingAssets && !hasProjectContent);
    setShowStrategyDocuments(isTypingStrategyDocuments && !hasProjectContent);
  };

  // Helper function to check for intelligent partial matching
  const isPartialMatch = (input, target) => {
    const words = input.split(' ');
    const lastWord = words[words.length - 1];
    const secondToLastWord = words[words.length - 2];
    
    // Check if we're building up to the target phrase
    if (lastWord && target.startsWith(lastWord) && lastWord.length >= 3) {
      return true;
    }
    
    // Check if we have the first word and are typing the second word
    const firstWord = target.split(' ')[0];
    const secondWord = target.split(' ')[1];
    if (secondToLastWord === firstWord && secondWord && secondWord.startsWith(lastWord)) {
      return true;
    }
    
    return false;
  };

  const handlePlanningAssetClick = (asset) => {
    setInputValue(asset);
    setShowPlanningAssets(false);
    setShowMarketingAssets(false);
    setShowStrategyDocuments(false);
  };

  const handleMarketingAssetClick = (asset) => {
    setInputValue(asset);
    setShowPlanningAssets(false);
    setShowMarketingAssets(false);
    setShowStrategyDocuments(false);
  };

  const handleStrategyDocumentClick = (asset) => {
    setInputValue(asset);
    setShowPlanningAssets(false);
    setShowMarketingAssets(false);
    setShowStrategyDocuments(false);
  };

  // Mic menu handlers
  const handleMicClick = () => {
    setShowMicMenu(!showMicMenu);
    setMicMenuLevel(1);
  };

  const handleMicMenuBack = () => {
    if (micMenuLevel > 1) {
      setMicMenuLevel(micMenuLevel - 1);
    } else {
      setShowMicMenu(false);
    }
  };

  const handleProjectsClick = () => {
    setMicMenuLevel(2);
  };

  const handleSaveAsProjectClick = () => {
    setMicMenuLevel(3);
  };

  // Response action handlers
  const handleThumbsUp = () => {
    console.log('Thumbs up clicked');
    // Add your thumbs up logic here
  };

  const handleThumbsDown = () => {
    console.log('Thumbs down clicked');
    // Add your thumbs down logic here
  };

  const handleCopy = async () => {
    try {
      // Get the conversation text
      const conversationElement = document.querySelector('.chat-interface__project-conversation');
      if (conversationElement) {
        const conversationText = conversationElement.innerText;
        await navigator.clipboard.writeText(conversationText);
        console.log('Conversation copied to clipboard');
        // You could add a toast notification here
      }
    } catch (err) {
      console.error('Failed to copy conversation: ', err);
    }
  };

  // Hide planning assets when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.chat-interface__input-area') && 
          !event.target.closest('.chat-interface__planning-assets') &&
          !event.target.closest('.chat-interface__marketing-assets') &&
          !event.target.closest('.chat-interface__strategy-documents') &&
          !event.target.closest('.chat-interface__mic-menu')) {
        setShowPlanningAssets(false);
        setShowMarketingAssets(false);
        setShowStrategyDocuments(false);
        setShowMicMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Preload input when external prompt is provided
  useEffect(() => {
    if (externalPrompt) {
      setInputValue(externalPrompt);
    }
  }, [externalPrompt]);

  return (
    <div className={`chat-interface ${selectedProject ? 'chat-interface--has-content' : 'chat-interface--empty'} ${showStrategyDocuments ? 'chat-interface--strategy-showing' : ''} ${showPlanningAssets ? 'chat-interface--planning-showing' : ''} ${showMarketingAssets ? 'chat-interface--marketing-showing' : ''}`}>
      {/* Project Conversation Content */}
      {selectedProject && (
        <div className="chat-interface__project-content">
          <div className="chat-interface__project-conversation">
            <p>
              <span>Absolutely, I'm ready to help craft a high-performing nurture email sequence for your campaign. To get started, I'll need to clarify a few details to ensure your emails are precisely tailored and impactful:</span>
            </p>
            <p>
              <span style={{ fontWeight: 600 }}>Key Info Needed</span>
            </p>
            <p>
              <span style={{ fontWeight: 600 }}>Ideal Customer Profile (ICP):</span>
            </p>
            <p>
              <span>Who is your target audience for this sequence? (e.g., Industry, role/title, company size, pain points)</span>
            </p>
            <p>
              <span style={{ fontWeight: 600 }}>Journey Stages:</span>
            </p>
            <p>
              <span>From which stage of the customer journey are you starting? (e.g., Problem-Aware, Solution-Aware)</span>
              <br />
              <span>To which stage do you want to guide them? (e.g., Product-Aware, Ready to Purchase)</span>
            </p>
            <p>
              <span style={{ fontWeight: 600 }}>Product/Service:</span>
            </p>
            <p>
              <span>What product or service are you nurturing them toward? (A brief summary or product name will help.)</span>
            </p>
            <p>
              <span style={{ fontWeight: 600 }}>Special Offers or CTAs:</span>
            </p>
            <p>
              <span>Any specific offers (e.g., free trial, demo, white paper) or CTAs you want to include?</span>
            </p>
            <p>
              <span style={{ fontWeight: 600 }}>Next Steps:</span>
            </p>
            <p>
              <span>Once you provide these details (or upload the relevant Positioning Statement, ICP, etc.), I'll develop a creative brief for the sequence—with a recommended number of emails, core topics, and the main purpose of each message.</span>
              <br />
              <span>After you approve the brief, I'll draft the copy for each email in your brand voice, addressing ICP pain points, guiding them step by step, and including clear calls to action.</span>
            </p>
            <p>
              <span style={{ fontWeight: 600 }}>Let's Get Started!</span>
            </p>
            <p>
              <span>Please provide the details above, or let me know if you'd like me to review any files you've uploaded for context.</span>
            </p>
            
            {/* Chat Response Actions */}
            <div className="chat-interface__response-actions">
              <button className="chat-interface__response-button chat-interface__thumbs-up" title="Thumbs up" onClick={handleThumbsUp}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.864 1.6c.8 0 1.45.65 1.45 1.45v2.9H14.1c.8 0 1.45.65 1.45 1.45 0 .25-.05.5-.15.75l-2 5.5c-.2.5-.65.85-1.2.85H5.4c-.8 0-1.45-.65-1.45-1.45V8.5c0-.4.15-.75.4-1.05l3.5-4.5c.3-.35.7-.55 1.15-.55h.05c.1 0 .2 0 .3.05.1.05.15.15.15.25v1.45c0 .8-.65 1.45-1.45 1.45H6.9l1.95-2.5v-.5zM2.5 7h1v6.5h-1c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1z" fill="currentColor"/>
                </svg>
              </button>
              <button className="chat-interface__response-button chat-interface__thumbs-down" title="Thumbs down" onClick={handleThumbsDown}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.136 14.4c-.8 0-1.45-.65-1.45-1.45v-2.9H1.9c-.8 0-1.45-.65-1.45-1.45 0-.25.05-.5.15-.75l2-5.5c.2-.5.65-.85 1.2-.85H10.6c.8 0 1.45.65 1.45 1.45V7.5c0 .4-.15.75-.4 1.05l-3.5 4.5c-.3.35-.7.55-1.15.55h-.05c-.1 0-.2 0-.3-.05-.1-.05-.15-.15-.15-.25v-1.45c0-.8.65-1.45 1.45-1.45H9.1l-1.95 2.5v.5zM13.5 9h-1V2.5h1c.55 0 1 .45 1 1V8c0 .55-.45 1-1 1z" fill="currentColor"/>
                </svg>
              </button>
              <button className="chat-interface__response-button chat-interface__copy" title="Copy" onClick={handleCopy}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 2h8c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm0 1.5c-.275 0-.5.225-.5.5v8c0 .275.225.5.5.5h8c.275 0 .5-.225.5-.5V4c0-.275-.225-.5-.5-.5H4zM1 6v9c0 1.1.9 2 2 2h9v-1.5H3c-.275 0-.5-.225-.5-.5V6H1z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Chat Input Area */}
      <div className="chat-interface__input-area">
        {/* Input Field */}
        <div className="chat-interface__input-container">
          <textarea
            className="chat-interface__input-field"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows={1}
          />
        </div>
        
        {/* Input Controls */}
        <div className="chat-interface__controls">
          <div className="chat-interface__left-controls">
                      <div className="chat-interface__mic-container" onClick={handleMicClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 20 20" className="mic-icon">
              <g style={{stroke: 'none', strokeWidth: 0, strokeDasharray: 'none', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 10, fill: 'white', fillRule: 'nonzero', opacity: 1}}>
                <rect x="1" y="1" width="18" height="18" rx="3" ry="3" style={{fill: 'none', stroke: 'white', strokeWidth: 0.5}}/>
                <path d="M10 5 C10.5523 5 11 5.4477 11 6 L11 14 C11 14.5523 10.5523 15 10 15 C9.4477 15 9 14.5523 9 14 L9 6 C9 5.4477 9.4477 5 10 5 Z" style={{fill: 'white'}}/>
                <path d="M5 10 C5 9.4477 5.4477 9 6 9 L14 9 C14.5523 9 15 9.4477 15 10 C15 10.5523 14.5523 11 14 11 L6 11 C5.4477 11 5 10.5523 5 10 Z" style={{fill: 'white'}}/>
              </g>
            </svg>
          </div>
            <div 
              className="chat-interface__attach-container"
              onClick={onOpenTemplateDrawer}
              style={{ cursor: 'pointer' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="20" height="20" viewBox="0 0 20 20">
                <defs>
                  <clipPath id="clipPathTemplate">
                    <path d="M0 0L20 0L20 20L0 20L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
                  </clipPath>
                </defs>
                <g clipPath="url(#clipPathTemplate)">
                  <path d="M7.93247 12.1847L1.19685 12.1847C0.536876 12.1847 0 11.6431 0 10.9769L0 1.20778C0 0.541778 0.536876 0 1.19685 0L7.93247 0C8.59245 0 9.12932 0.541778 9.12932 1.20778L9.12932 10.9771C9.12932 11.6431 8.59245 12.1847 7.93247 12.1847ZM1.19685 0.888889C1.02266 0.888889 0.880848 1.032 0.880848 1.20778L0.880848 10.9771C0.880848 11.1529 1.02266 11.296 1.19685 11.296L7.93247 11.296C8.10666 11.296 8.24848 11.1529 8.24848 10.9771L8.24848 1.20778C8.24848 1.032 8.10666 0.888889 7.93247 0.888889L1.19685 0.888889Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)" fill="rgb(232, 232, 232)"/>
                  <path d="M7.93247 5.83467L1.19685 5.83467C0.536876 5.83467 0 5.29311 0 4.62689L0 1.20778C0 0.541778 0.536876 0 1.19685 0L7.93247 0C8.59245 0 9.12932 0.541778 9.12932 1.20778L9.12932 4.62711C9.12932 5.29311 8.59245 5.83467 7.93247 5.83467ZM1.19685 0.88889C1.02266 0.88889 0.880848 1.032 0.880848 1.20778L0.880848 4.62711C0.880848 4.80267 1.02266 4.94578 1.19685 4.94578L7.93247 4.94578C8.10666 4.94578 8.24848 4.80267 8.24848 4.62689L8.24848 1.20778C8.24848 1.032 8.10666 0.88889 7.93247 0.88889L1.19685 0.88889Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 14.1653)" fill="rgb(232, 232, 232)"/>
                  <path d="M7.93247 12.1844L1.19685 12.1844C0.536877 12.1844 0 11.6427 0 10.9767L0 1.20756C0 0.541556 0.536877 0 1.19685 0L7.93269 0C8.59267 0 9.12954 0.541778 9.12954 1.20756L9.12954 10.9769C9.12932 11.6429 8.59267 12.1844 7.93247 12.1844ZM1.19685 0.888667C1.02266 0.888667 0.880848 1.03178 0.880848 1.20733L0.880848 10.9767C0.880848 11.1524 1.02266 11.2956 1.19685 11.2956L7.93269 11.2956C8.10666 11.2956 8.24848 11.1524 8.24848 10.9767L8.24848 1.20756C8.24848 1.03178 8.10666 0.888889 7.93247 0.888889L1.19685 0.888667Z" fillRule="nonzero" transform="matrix(1 0 0 1 10.6892 7.81558)" fill="rgb(232, 232, 232)"/>
                  <path d="M7.93247 5.83467L1.19685 5.83467C0.536877 5.83467 0 5.29289 0 4.62689L0 1.20778C0 0.541778 0.536656 0 1.19685 0L7.93269 0C8.59267 0 9.12932 0.541778 9.12932 1.20778L9.12932 4.62711C9.12932 5.29289 8.59267 5.83467 7.93247 5.83467ZM1.19685 0.888889C1.02266 0.888889 0.880848 1.032 0.880848 1.20778L0.880848 4.62711C0.880848 4.80289 1.02266 4.946 1.19685 4.946L7.93269 4.946C8.10688 4.946 8.2487 4.80289 8.2487 4.62711L8.2487 1.20778C8.24848 1.032 8.10666 0.888889 7.93247 0.888889L1.19685 0.888889Z" fillRule="nonzero" transform="matrix(1 0 0 1 10.6892 0)" fill="rgb(232, 232, 232)"/>
                </g>
              </svg>
            </div>
          </div>
          
          <div className="chat-interface__right-controls">
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="18" height="18" viewBox="0 0 18 18">
              <defs>
                <clipPath id="clipPathMicrophone">
                  <path d="M0 0L18 0L18 18L0 18L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 -5.34058e-05)"/>
                </clipPath>
              </defs>
              <g clipPath="url(#clipPathMicrophone)">
                <path d="M5.73806 6.35036C2.57425 6.35036 0 3.77631 0 0.612295C0 0.274041 0.274239 0 0.612294 0C0.950548 0 1.22459 0.274239 1.22459 0.612295C1.22479 3.10099 3.24937 5.12577 5.73806 5.12577C8.22656 5.12577 10.2513 3.10099 10.2513 0.61249C10.2513 0.274236 10.5254 0.000196338 10.8636 0.000196338C11.2019 0.000196338 11.4759 0.274435 11.4759 0.61249C11.4761 3.77631 8.90188 6.35036 5.73806 6.35036Z" fillRule="nonzero" transform="matrix(1 0 0 1 3.25185 7.77022)" fill="rgb(232, 232, 232)"/>
                <path d="M3.69471 12.0005C1.66262 12.0005 0 10.3379 0 8.30579L0 3.69471C0 1.66262 1.66262 0 3.69471 0C5.7268 0 7.38942 1.66262 7.38942 3.69471L7.38942 8.30559C7.38942 10.3377 5.7268 12.0005 3.69471 12.0005Z" fillRule="nonzero" transform="matrix(1 0 0 1 5.2952 0.0988482)" fill="rgb(232, 232, 232)"/>
                <path d="M0.612294 4.67411C0.27404 4.67411 0 4.40006 0 4.06181L0 0.612295C0 0.274041 0.274238 0 0.612294 0C0.950548 0 1.22459 0.274041 1.22459 0.612295L1.22459 4.06181C1.22459 4.40006 0.950548 4.67411 0.612294 4.67411Z" fillRule="nonzero" transform="matrix(1 0 0 1 8.37762 13.0513)" fill="rgb(232, 232, 232)"/>
                <path d="M4.74207 1.22459L0.612294 1.22459C0.27404 1.22459 0 0.950547 0 0.612294C0 0.27404 0.274238 0 0.612294 0L4.74187 0C5.08013 0 5.35417 0.27404 5.35417 0.612294C5.35417 0.950547 5.08033 1.22459 4.74207 1.22459Z" fillRule="nonzero" transform="matrix(1 0 0 1 6.31274 16.6563)" fill="rgb(232, 232, 232)"/>
              </g>
            </svg>
            <div 
              className="chat-interface__send-button"
              onClick={handleSubmit}
            >
              <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="18" height="18" viewBox="0 0 18 18">
                <defs>
                  <clipPath id="clipPathSend">
                    <path d="M0 0L18 0L18 18L0 18L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
                  </clipPath>
                </defs>
                <g clipPath="url(#clipPathSend)">
                  <path d="M17.7818 0.607503C17.782 0.596637 17.782 0.586165 17.7818 0.575298C17.7811 0.548823 17.7785 0.522742 17.7743 0.496662C17.773 0.488561 17.7726 0.480658 17.7708 0.472558C17.7641 0.439957 17.7546 0.407949 17.7423 0.37693C17.7388 0.367841 17.7342 0.359345 17.7303 0.350454C17.7198 0.326942 17.708 0.304221 17.6943 0.282092C17.6888 0.273004 17.6833 0.263915 17.6771 0.254826C17.657 0.225782 17.6352 0.197924 17.6098 0.172436C17.5841 0.146751 17.5558 0.12482 17.5266 0.104469C17.5183 0.0987397 17.5098 0.093405 17.5011 0.088268C17.4778 0.0738448 17.4539 0.0613974 17.4292 0.0505306C17.4215 0.0471718 17.4142 0.0432202 17.4062 0.040059C17.3744 0.0276115 17.3416 0.0177326 17.3081 0.011015C17.3019 0.0098295 17.2956 0.00943434 17.2895 0.00824887C17.2614 0.003507 17.2332 0.000740905 17.2047 0.00014817C17.1952 -4.93926e-05 17.1859 -4.93926e-05 17.1767 0.000148186C17.1488 0.00074092 17.1209 0.00350701 17.0931 0.00824889C17.0862 0.00943436 17.0795 0.00982952 17.0725 0.0112126C17.0421 0.0173375 17.0121 0.0256358 16.9824 0.0367001L0.384498 6.26496C0.16242 6.34833 0.0114701 6.55599 0.00060336 6.79308C-0.0100659 7.02998 0.121521 7.25067 0.335103 7.35381L7.14266 10.6391L10.4278 17.4467C10.5272 17.6524 10.7352 17.782 10.9618 17.782C10.9709 17.782 10.9798 17.7818 10.9889 17.7814C11.2258 17.7705 11.4337 17.6196 11.517 17.3975L17.7455 0.799747C17.7566 0.770308 17.7647 0.740473 17.7708 0.710244C17.7724 0.702143 17.773 0.69424 17.7741 0.686139C17.7785 0.660059 17.7811 0.633781 17.7818 0.607503ZM14.8354 2.1085L7.4655 9.47837L2.09809 6.88831L14.8354 2.1085ZM10.8937 15.6839L8.30363 10.3167L15.6737 2.94663L10.8937 15.6839Z" fillRule="nonzero" transform="matrix(1 0 0 1 0.098877 0.0989456)" fill="var(--theme-bg-primary)"/>
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Mic Menu */}
        {showMicMenu && (
          <div className="chat-interface__mic-menu">
            {micMenuLevel === 1 && (
              <div className="chat-interface__mic-menu-main">
                <div className="chat-interface__mic-menu-item">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1.5L9 16.5M1.5 9L16.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Upload a file</span>
                </div>
                <div className="chat-interface__mic-menu-item">
                  <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
                    <circle cx="9.5" cy="9.5" r="8.5" stroke="currentColor" strokeWidth="1"/>
                    <path d="M6.5 9.5L8.5 11.5L12.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Crawl a website</span>
                </div>
                <div className="chat-interface__mic-menu-item">
                  <svg width="18.94" height="15.56" viewBox="0 0 19 16" fill="none">
                    <rect x="1" y="1" width="17" height="14" rx="2" stroke="currentColor" strokeWidth="1"/>
                    <path d="M1 4L19 4" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                  <span>Take a screenshot</span>
                </div>
                <div className="chat-interface__mic-menu-item">
                  <svg width="18.92" height="19.59" viewBox="0 0 19 20" fill="none">
                    <path d="M10 1L17 8L10 15M17 8L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Add a link/URL</span>
                </div>
                <div className="chat-interface__mic-menu-item">
                  <svg width="15.32" height="18.19" viewBox="0 0 15 18" fill="none">
                    <path d="M1 1L1 17L14 9L1 1Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Download as a PDF</span>
                </div>
                <div className="chat-interface__mic-menu-item chat-interface__mic-menu-item--expandable">
                  <div className="chat-interface__mic-menu-item-content">
                    <svg width="17.78" height="17.78" viewBox="0 0 18 18" fill="none">
                      <path d="M9 1L12 4L9 7M12 4L1 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Export to...</span>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="chat-interface__mic-menu-divider"></div>
                <div className="chat-interface__mic-menu-item chat-interface__mic-menu-item--expandable" onClick={handleProjectsClick}>
                  <div className="chat-interface__mic-menu-item-content">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1"/>
                      <path d="M6 6L12 6M6 9L12 9M6 12L9 12" stroke="currentColor" strokeWidth="1"/>
                    </svg>
                    <span>Projects</span>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M7 6L11 10L7 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            )}

            {micMenuLevel === 2 && (
              <div className="chat-interface__mic-menu-projects">
                <div className="chat-interface__mic-menu-header">
                  <button className="chat-interface__mic-menu-back" onClick={handleMicMenuBack}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M11 6L7 10L11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <div className="chat-interface__mic-menu-search">
                    <input type="text" placeholder="Search projects" />
                  </div>
                </div>
                <div className="chat-interface__mic-menu-item">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1"/>
                    <path d="M6 6L12 6M6 9L12 9M6 12L9 12" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                  <span>Project 1</span>
                </div>
                <div className="chat-interface__mic-menu-item">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1"/>
                    <path d="M6 6L12 6M6 9L12 9M6 12L9 12" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                  <span>Project 2</span>
                </div>
                <div className="chat-interface__mic-menu-item">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1"/>
                    <path d="M6 6L12 6M6 9L12 9M6 12L9 12" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                  <span>Project 3</span>
                </div>
                <div className="chat-interface__mic-menu-item">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1"/>
                    <path d="M6 6L12 6M6 9L12 9M6 12L9 12" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                  <span>Project 4</span>
                </div>
                <div className="chat-interface__mic-menu-divider"></div>
                <div className="chat-interface__mic-menu-item" onClick={handleSaveAsProjectClick}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1L9 17M1 9L17 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Save as a project</span>
                </div>
              </div>
            )}

            {micMenuLevel === 3 && (
              <div className="chat-interface__mic-menu-export">
                <div className="chat-interface__mic-menu-header">
                  <button className="chat-interface__mic-menu-back" onClick={handleMicMenuBack}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M11 6L7 10L11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div className="chat-interface__mic-menu-item">
                  <svg width="17.78" height="17.78" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1"/>
                    <path d="M6 9L8 11L12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Dropbox</span>
                </div>
                <div className="chat-interface__mic-menu-item">
                  <svg width="17.78" height="17.78" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1"/>
                    <path d="M6 9L8 11L12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Google Drive</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Planning Assets List */}
        {showPlanningAssets && (
          <div className="chat-interface__planning-assets">
            <div className="chat-interface__mini-cards">
              {planningAssets.slice(0, 8).map((asset, index) => {
                const data = deriveMiniCard(asset);
                return (
                  <div
                    key={index}
                    className="chat-interface__mini-card"
                    onClick={() => handlePlanningAssetClick(asset)}
                    style={{ animationDelay: `${index * 0.06}s` }}
                  >
                    <div className="chat-interface__mini-card-header">
                      <div className="chat-interface__mini-card-title-section">
                        <h4 className="chat-interface__mini-card-title" title={data.title}>{data.title}</h4>
                      </div>
                      <div className="chat-interface__mini-card-info" aria-hidden>
                        <svg className="template-drawer__card-info-icon" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 90 90" style={{fill: 'var(--theme-primary-deep, #E6A429)'}}>
                          <g>
                            <path d="M 37.267 41.251 c -0.249 1.047 0.268 2.116 1.233 2.594 c 1.543 0.765 2.511 2.474 2.213 4.305 l -2.516 15.471 c -0.306 1.88 0.97 3.652 2.85 3.958 h 0 c 2.783 0.453 5.627 0.25 8.308 -0.583 c 0.771 -0.24 1.354 -0.879 1.541 -1.664 l 0.427 -1.801 c 0.249 -1.047 -0.268 -2.116 -1.233 -2.594 c -1.543 -0.765 -2.511 -2.474 -2.213 -4.305 l 2.516 -15.471 c 0.306 -1.88 -0.97 -3.652 -2.85 -3.958 h 0 c -2.783 -0.453 -5.627 -0.25 -8.308 0.583 c -0.771 0.24 -1.354 0.879 -1.541 1.664 L 37.267 41.251 z"></path>
                            <circle cx="47.093" cy="27.893" r="5.703"></circle>
                            <path d="M 45 90 C 20.187 90 0 69.813 0 45 C 0 20.187 20.187 0 45 0 c 24.813 0 45 20.187 45 45 C 90 69.813 69.813 90 45 90 z M 45 7.098 C 24.101 7.098 7.098 24.101 7.098 45 S 24.101 82.902 45 82.902 S 82.902 65.899 82.902 45 S 65.899 7.098 45 7.098 z"></path>
                          </g>
                        </svg>
                        <div className="chat-interface__mini-card-tooltip">
                          <div className="chat-interface__mini-card-tooltip-content">
                            <h4>{data.title}</h4>
                            <p>{asset}</p>
                            <div className="chat-interface__mini-card-tooltip-tags">
                              {data.tags.map((tag, i) => (
                                <span key={`${tag}-${i}`} className="chat-interface__mini-card-tooltip-tag">{tag}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="chat-interface__mini-card-footer">
                      <MiniCardTags tags={data.tags} />
                      <div className="chat-interface__mini-card-pill" aria-hidden>
                        <svg width="34" height="18" viewBox="0 0 90.44 109.83" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id="linear-gradient" x1="45.22" y1="-20.72" x2="45.22" y2="71.87" gradientTransform="translate(0 82.04) scale(1 -1)" gradientUnits="userSpaceOnUse">
                              <stop offset="0" stopColor="#fed830"/>
                              <stop offset="1" stopColor="#fbaf17"/>
                            </linearGradient>
                          </defs>
                          <path fill="url(#linear-gradient)" d="M70.97,10.16H19.47c-6.05,0-10.93,4.9-10.93,10.93v51.5c0,6.05,4.9,10.93,10.93,10.93v18.76c0,.42.51.64.8.33l19.08-19.08h31.62c6.05,0,10.93-4.9,10.93-10.93V21.09c0-6.05-4.9-10.93-10.93-10.93ZM49.93,66.65l-3.28-8.07h-14.8l-3.17,8.07h-9.26l16.49-38.13h6.94l16.58,38.13h-9.48s-.02,0-.02,0ZM70.4,66.65h-8.07v-26.17h8.07v26.17ZM69.66,35.54c-.91.91-2.03,1.37-3.32,1.37s-2.4-.46-3.32-1.37-1.37-2.03-1.37-3.32.46-2.4,1.37-3.32,2.03-1.37,3.32-1.37,2.4.46,3.32,1.37,1.37,2.03,1.37,3.32-.46,2.4-1.37,3.32Z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="chat-interface__mini-cards-cta">
             <button className="chat-interface__mini-cards-link" onClick={onOpenTemplateDrawer}>view more templates</button>
            </div>
          </div>
        )}

        {/* Marketing Assets List */}
        {showMarketingAssets && (
          <div className="chat-interface__marketing-assets">
            <div className="chat-interface__mini-cards">
              {marketingAssets.slice(0, 8).map((asset, index) => {
                const data = deriveMiniCard(asset);
                return (
                  <div
                    key={index}
                    className="chat-interface__mini-card"
                    onClick={() => handleMarketingAssetClick(asset)}
                    style={{ animationDelay: `${index * 0.06}s` }}
                  >
                    <div className="chat-interface__mini-card-header">
                      <div className="chat-interface__mini-card-title-section">
                        <h4 className="chat-interface__mini-card-title" title={data.title}>{data.title}</h4>
                      </div>
                      <div className="chat-interface__mini-card-info" aria-hidden>
                        <svg className="template-drawer__card-info-icon" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 90 90" style={{fill: 'var(--theme-primary-deep, #E6A429)'}}>
                          <g>
                            <path d="M 37.267 41.251 c -0.249 1.047 0.268 2.116 1.233 2.594 c 1.543 0.765 2.511 2.474 2.213 4.305 l -2.516 15.471 c -0.306 1.88 0.97 3.652 2.85 3.958 h 0 c 2.783 0.453 5.627 0.25 8.308 -0.583 c 0.771 -0.24 1.354 -0.879 1.541 -1.664 l 0.427 -1.801 c 0.249 -1.047 -0.268 -2.116 -1.233 -2.594 c -1.543 -0.765 -2.511 -2.474 -2.213 -4.305 l 2.516 -15.471 c 0.306 -1.88 -0.97 -3.652 -2.85 -3.958 h 0 c -2.783 -0.453 -5.627 -0.25 -8.308 0.583 c -0.771 0.24 -1.354 0.879 -1.541 1.664 L 37.267 41.251 z"></path>
                            <circle cx="47.093" cy="27.893" r="5.703"></circle>
                            <path d="M 45 90 C 20.187 90 0 69.813 0 45 C 0 20.187 20.187 0 45 0 c 24.813 0 45 20.187 45 45 C 90 69.813 69.813 90 45 90 z M 45 7.098 C 24.101 7.098 7.098 24.101 7.098 45 S 24.101 82.902 45 82.902 S 82.902 65.899 82.902 45 S 65.899 7.098 45 7.098 z"></path>
                          </g>
                        </svg>
                        <div className="chat-interface__mini-card-tooltip">
                          <div className="chat-interface__mini-card-tooltip-content">
                            <h4>{data.title}</h4>
                            <p>{asset}</p>
                            <div className="chat-interface__mini-card-tooltip-tags">
                              {data.tags.map((tag, i) => (
                                <span key={`${tag}-${i}`} className="chat-interface__mini-card-tooltip-tag">{tag}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="chat-interface__mini-card-footer">
                      <MiniCardTags tags={data.tags} />
                      <div className="chat-interface__mini-card-pill" aria-hidden>
                        <svg width="34" height="18" viewBox="0 0 90.44 109.83" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id="linear-gradient" x1="45.22" y1="-20.72" x2="45.22" y2="71.87" gradientTransform="translate(0 82.04) scale(1 -1)" gradientUnits="userSpaceOnUse">
                              <stop offset="0" stopColor="#fed830"/>
                              <stop offset="1" stopColor="#fbaf17"/>
                            </linearGradient>
                          </defs>
                          <path fill="url(#linear-gradient)" d="M70.97,10.16H19.47c-6.05,0-10.93,4.9-10.93,10.93v51.5c0,6.05,4.9,10.93,10.93,10.93v18.76c0,.42.51.64.8.33l19.08-19.08h31.62c6.05,0,10.93-4.9,10.93-10.93V21.09c0-6.05-4.9-10.93-10.93-10.93ZM49.93,66.65l-3.28-8.07h-14.8l-3.17,8.07h-9.26l16.49-38.13h6.94l16.58,38.13h-9.48s-.02,0-.02,0ZM70.4,66.65h-8.07v-26.17h8.07v26.17ZM69.66,35.54c-.91.91-2.03,1.37-3.32,1.37s-2.4-.46-3.32-1.37-1.37-2.03-1.37-3.32.46-2.4,1.37-3.32,2.03-1.37,3.32-1.37,2.4.46,3.32,1.37,1.37,2.03,1.37,3.32-.46,2.4-1.37,3.32Z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="chat-interface__mini-cards-cta">
             <button className="chat-interface__mini-cards-link" onClick={onOpenTemplateDrawer}>view more templates</button>
            </div>
          </div>
        )}

        {/* Strategy Documents List */}
        {showStrategyDocuments && (
          <div className="chat-interface__strategy-documents">
            <div className="chat-interface__mini-cards">
              {strategyDocuments.slice(0, 8).map((asset, index) => {
                const data = deriveMiniCard(asset);
                return (
                  <div
                    key={index}
                    className="chat-interface__mini-card"
                    onClick={() => handleStrategyDocumentClick(asset)}
                    style={{ animationDelay: `${index * 0.06}s` }}
                  >
                    <div className="chat-interface__mini-card-header">
                      <div className="chat-interface__mini-card-title-section">
                        <h4 className="chat-interface__mini-card-title" title={data.title}>{data.title}</h4>
                      </div>
                      <div className="chat-interface__mini-card-info" aria-hidden>
                        <svg className="template-drawer__card-info-icon" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 90 90" style={{fill: 'var(--theme-primary-deep, #E6A429)'}}>
                          <g>
                            <path d="M 37.267 41.251 c -0.249 1.047 0.268 2.116 1.233 2.594 c 1.543 0.765 2.511 2.474 2.213 4.305 l -2.516 15.471 c -0.306 1.88 0.97 3.652 2.85 3.958 h 0 c 2.783 0.453 5.627 0.25 8.308 -0.583 c 0.771 -0.24 1.354 -0.879 1.541 -1.664 l 0.427 -1.801 c 0.249 -1.047 -0.268 -2.116 -1.233 -2.594 c -1.543 -0.765 -2.511 -2.474 -2.213 -4.305 l 2.516 -15.471 c 0.306 -1.88 -0.97 -3.652 -2.85 -3.958 h 0 c -2.783 -0.453 -5.627 -0.25 -8.308 0.583 c -0.771 0.24 -1.354 0.879 -1.541 1.664 L 37.267 41.251 z"></path>
                            <circle cx="47.093" cy="27.893" r="5.703"></circle>
                            <path d="M 45 90 C 20.187 90 0 69.813 0 45 C 0 20.187 20.187 0 45 0 c 24.813 0 45 20.187 45 45 C 90 69.813 69.813 90 45 90 z M 45 7.098 C 24.101 7.098 7.098 24.101 7.098 45 S 24.101 82.902 45 82.902 S 82.902 65.899 82.902 45 S 65.899 7.098 45 7.098 z"></path>
                          </g>
                        </svg>
                        <div className="chat-interface__mini-card-tooltip">
                          <div className="chat-interface__mini-card-tooltip-content">
                            <h4>{data.title}</h4>
                            <p>{asset}</p>
                            <div className="chat-interface__mini-card-tooltip-tags">
                              {data.tags.map((tag, i) => (
                                <span key={`${tag}-${i}`} className="chat-interface__mini-card-tooltip-tag">{tag}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="chat-interface__mini-card-footer">
                      <MiniCardTags tags={data.tags} />
                      <div className="chat-interface__mini-card-pill" aria-hidden>
                        <svg width="34" height="18" viewBox="0 0 90.44 109.83" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id="linear-gradient" x1="45.22" y1="-20.72" x2="45.22" y2="71.87" gradientTransform="translate(0 82.04) scale(1 -1)" gradientUnits="userSpaceOnUse">
                              <stop offset="0" stopColor="#fed830"/>
                              <stop offset="1" stopColor="#fbaf17"/>
                            </linearGradient>
                          </defs>
                          <path fill="url(#linear-gradient)" d="M70.97,10.16H19.47c-6.05,0-10.93,4.9-10.93,10.93v51.5c0,6.05,4.9,10.93,10.93,10.93v18.76c0,.42.51.64.8.33l19.08-19.08h31.62c6.05,0,10.93-4.9,10.93-10.93V21.09c0-6.05-4.9-10.93-10.93-10.93ZM49.93,66.65l-3.28-8.07h-14.8l-3.17,8.07h-9.26l16.49-38.13h6.94l16.58,38.13h-9.48s-.02,0-.02,0ZM70.4,66.65h-8.07v-26.17h8.07v26.17ZM69.66,35.54c-.91.91-2.03,1.37-3.32,1.37s-2.4-.46-3.32-1.37-1.37-2.03-1.37-3.32.46-2.4,1.37-3.32,2.03-1.37,3.32-1.37,2.4.46,3.32,1.37,1.37,2.03,1.37,3.32-.46,2.4-1.37,3.32Z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="chat-interface__mini-cards-cta">
             <button className="chat-interface__mini-cards-link" onClick={onOpenTemplateDrawer}>view more templates</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface; 