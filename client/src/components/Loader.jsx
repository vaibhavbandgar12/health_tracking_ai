import React, { useState, useEffect } from 'react';
import { Activity, Brain, Shield, HeartPulse } from 'lucide-react';

export default function Loader({ isVisible, message = "AI Model is analyzing your vitals..." }) {
  const [currentStep, setCurrentStep] = useState(0);

  const analysisSteps = [
    "Preprocessing biometrics & log values...",
    "Computing Body Mass Index (BMI) and categorization...",
    "Calculating Basal Metabolic Rate & calorie boundaries...",
    "Simulating cardiovascular health risk scoring...",
    "Generating personalized diet & workout directives...",
    "Compiling insights and saving log details..."
  ];

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < analysisSteps.length - 1 ? prev + 1 : prev));
    }, 500);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass max-w-md w-full p-8 border border-white/10 text-center relative overflow-hidden shadow-2xl">
        {/* Background glow animations */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 rounded-full filter blur-[60px] animate-pulse" />
        
        {/* Glowing Icons Container */}
        <div className="relative flex justify-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-primary-hover animate-pulse">
            <HeartPulse className="w-6 h-6 text-rose-400" />
          </div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-primary/20 relative animate-spin [animation-duration:8s]">
            <Brain className="w-8 h-8" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-primary-hover animate-pulse">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        {/* Text descriptions */}
        <h3 className="text-xl font-bold text-white mb-2 font-display">AI Vitals Diagnostics</h3>
        <p className="text-slate-400 text-sm mb-6">{message}</p>

        {/* Progress Bar Container */}
        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-5 border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${((currentStep + 1) / analysisSteps.length) * 100}%` }}
          />
        </div>

        {/* Dynamic loading steps */}
        <div className="h-6 flex items-center justify-center overflow-hidden">
          <p className="text-xs font-mono text-emerald-400 animate-pulse truncate px-4">
            {analysisSteps[currentStep]}
          </p>
        </div>
      </div>
    </div>
  );
}
