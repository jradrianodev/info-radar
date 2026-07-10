'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, DollarSign, Laptop, Check, RefreshCw, Star, AlertCircle, ShoppingCart } from 'lucide-react';
import { dbService } from '@/lib/db';
import { Product, Category, Brand } from '@/lib/seedData';
import confetti from 'canvas-confetti';

interface Question {
  id: string;
  title: string;
  field: string;
  options: { label: string; value: string }[];
}

export default function RadarIA() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [recommendations, setRecommendations] = useState<{ product: Product; score: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const allProds = await dbService.getProducts();
      const allCats = await dbService.getCategories();
      const allBrands = await dbService.getBrands();
      setProducts(allProds);
      setCategories(allCats);
      setBrands(allBrands);
    };
    loadData();
  }, []);

  const questions: Question[] = [
    {
      id: 'budget',
      title: 'Qual é o seu orçamento máximo?',
      field: 'budget',
      options: [
        { label: 'Custo-benefício (Até R$ 1.500)', value: '1500' },
        { label: 'Intermediário (R$ 1.500 a R$ 5.000)', value: '5000' },
        { label: 'Avançado (R$ 5.000 a R$ 10.000)', value: '10000' },
        { label: 'Entusiasta / Premium (Sem limites)', value: '99999' }
      ]
    },
    {
      id: 'type',
      title: 'Que tipo de dispositivo você procura?',
      field: 'category',
      options: [
        { label: 'Notebook', value: 'notebook' },
        { label: 'Celular / Smartphone', value: 'celular' },
        { label: 'Acessório / Periférico (Mouse/SSD)', value: 'periferico' },
        { label: 'Qualquer tecnologia recomendada', value: 'any' }
      ]
    },
    {
      id: 'usecase',
      title: 'Qual será o uso principal do produto?',
      field: 'usecase',
      options: [
        { label: 'Trabalho / Produtividade', value: 'work' },
        { label: 'Estudo e Navegação Casual', value: 'casual' },
        { label: 'Games de Alta Performance', value: 'gaming' },
        { label: 'Criação de Conteúdo e Design', value: 'creative' }
      ]
    },
    {
      id: 'os',
      title: 'Prefere algum sistema operacional específico?',
      field: 'os',
      options: [
        { label: 'Windows ou Android (Mais flexibilidade)', value: 'windows-android' },
        { label: 'macOS ou iOS (Ecossistema Apple)', value: 'apple' },
        { label: 'Tanto faz, quero o melhor custo-benefício', value: 'any' }
      ]
    },
    {
      id: 'brand',
      title: 'Você tem preferência por alguma marca?',
      field: 'brand',
      options: [
        { label: 'Apple', value: 'apple' },
        { label: 'Samsung', value: 'samsung' },
        { label: 'Dell', value: 'dell' },
        { label: 'Sem preferências de marca', value: 'any' }
      ]
    },
    {
      id: 'weight',
      title: 'O peso e a portabilidade são críticos para você?',
      field: 'weight',
      options: [
        { label: 'Sim, prefiro dispositivos super leves e compactos', value: 'lightweight' },
        { label: 'Prefiro telas maiores, mesmo que seja mais pesado', value: 'large' },
        { label: 'Não é um fator decisivo', value: 'any' }
      ]
    },
    {
      id: 'style',
      title: 'Uso profissional corporativo ou pessoal/casual?',
      field: 'style',
      options: [
        { label: 'Profissional / Foco em foco e durabilidade', value: 'pro' },
        { label: 'Casual / Lazer e multitarefa cotidiana', value: 'casual' }
      ]
    }
  ];

  const handleSelect = (value: string) => {
    const currentQuestion = questions[currentStep];
    setAnswers(prev => ({ ...prev, [currentQuestion.field]: value }));
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calculate Recommendations
      calculateRecommendations();
    }
  };

  const calculateRecommendations = () => {
    setLoading(true);
    
    setTimeout(async () => {
      // Scoring Algorithm
      const scored = products.map(prod => {
        let score = 100;
        const brand = brands.find(b => b.id === prod.brand_id);
        const category = categories.find(c => c.id === prod.category_id);
        
        // 1. Budget checking
        const budgetLimit = parseFloat(answers.budget || '99999');
        if (prod.price > budgetLimit) {
          const overage = prod.price - budgetLimit;
          // Deduct score proportionally to how far it exceeds budget
          score -= Math.min(60, Math.round((overage / budgetLimit) * 100));
        } else {
          // If it fits the budget, add points for efficiency
          score += 5;
        }

        // 2. Category matching
        const chosenCat = answers.category;
        if (chosenCat && chosenCat !== 'any') {
          if (chosenCat === 'notebook' && category?.slug !== 'notebook') {
            score -= 60;
          } else if (chosenCat === 'celular' && category?.slug !== 'celular') {
            score -= 60;
          } else if (chosenCat === 'periferico' && !['mouse', 'teclado', 'ssd', 'ram'].includes(category?.slug || '')) {
            score -= 40;
          }
        }

        // 3. Brand preference
        const preferredBrand = answers.brand;
        if (preferredBrand && preferredBrand !== 'any') {
          if (brand?.name.toLowerCase() === preferredBrand) {
            score += 15;
          } else {
            score -= 15;
          }
        }

        // 4. OS Match
        const preferredOS = answers.os;
        if (preferredOS && preferredOS !== 'any') {
          const isAppleProd = brand?.name.toLowerCase() === 'apple';
          if (preferredOS === 'apple' && !isAppleProd) {
            score -= 30;
          } else if (preferredOS === 'windows-android' && isAppleProd) {
            score -= 30;
          }
        }

        // 5. Weight & size specs filter
        const preferredWeight = answers.weight;
        if (preferredWeight === 'lightweight') {
          if (prod.name.toLowerCase().includes('air') || prod.description.toLowerCase().includes('leve')) {
            score += 10;
          }
        }

        // 6. Usecase matching
        const useCase = answers.usecase;
        if (useCase === 'work' || useCase === 'creative') {
          if (prod.name.toLowerCase().includes('pro') || prod.name.toLowerCase().includes('master')) {
            score += 15;
          }
        } else if (useCase === 'casual') {
          if (prod.name.toLowerCase().includes('air') || prod.price < 3000) {
            score += 10;
          }
        }

        return {
          product: prod,
          score: Math.min(100, Math.max(0, score))
        };
      });

      // Filter products with score > 40, sorted descending
      const filtered = scored
        .filter(s => s.score >= 40)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      setRecommendations(filtered);
      setLoading(false);
      setCurrentStep(questions.length); // trigger results view

      // Trigger Confetti explosion for premium feel
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#1E40AF', '#3B82F6', '#F8FAFC']
      });

    }, 800);
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
    setRecommendations([]);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark p-6 md:p-8 shadow-xl glow-blue relative overflow-hidden">
        
        {/* Glowing aura */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-brand-blue/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-brand-blue/10 blur-3xl" />

        <AnimatePresence mode="wait">
          {currentStep < questions.length ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="relative z-10"
            >
              {/* Header Wizard Info */}
              <div className="flex items-center justify-between mb-8">
                <span className="flex items-center gap-1.5 text-xs font-bold text-brand-blue bg-brand-blue/10 px-3 py-1.5 rounded-full border border-brand-blue/20">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  <span>Radar IA</span>
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Questão {currentStep + 1} de {questions.length}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mb-8 overflow-hidden">
                <div 
                  className="h-full bg-brand-blue rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question title */}
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white mb-6">
                {questions[currentStep].title}
              </h2>

              {/* Options list */}
              <div className="space-y-3">
                {questions[currentStep].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 hover:border-brand-blue dark:hover:border-brand-blue hover:bg-brand-blue/[0.03] dark:hover:bg-brand-blue/[0.02] text-slate-800 dark:text-slate-200 font-medium text-sm md:text-base transition-all active:scale-[0.99] cursor-pointer flex items-center justify-between group"
                  >
                    <span>{opt.label}</span>
                    <span className="h-5 w-5 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center group-hover:border-brand-blue transition-colors">
                      <span className="h-2 w-2 rounded-full bg-brand-blue scale-0 group-hover:scale-100 transition-transform" />
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 text-center"
            >
              {loading ? (
                <div className="py-16 space-y-4">
                  <RefreshCw className="h-10 w-10 text-brand-blue animate-spin mx-auto" />
                  <p className="text-sm text-slate-500 font-medium animate-pulse">
                    Filtrando banco de dados e calculando recomendações...
                  </p>
                </div>
              ) : (
                <div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-4 border border-emerald-500/20 shadow-sm">
                    <Check className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Temos suas recomendações!
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                    Baseado no seu orçamento e preferências de uso, o Radar IA pontuou os melhores produtos cadastrados:
                  </p>

                  {/* Recommendation Cards */}
                  <div className="space-y-4 text-left">
                    {recommendations.length > 0 ? (
                      recommendations.map((rec) => (
                        <div
                          key={rec.product.id}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 gap-4 hover:border-brand-blue/30 transition-all"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                                {rec.score}% Match
                              </span>
                              <span className="text-[10px] text-slate-400 font-semibold uppercase">Recomendado</span>
                            </div>
                            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                              {rec.product.name}
                            </h3>
                            <p className="text-xs text-slate-500 line-clamp-1">
                              {rec.product.description}
                            </p>
                          </div>
                          
                          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-slate-200 dark:border-slate-800 pt-3 sm:pt-0 gap-3">
                            <span className="text-base font-bold text-brand-blue">
                              R$ {rec.product.price.toLocaleString('pt-BR')}
                            </span>
                            <a
                              href={`/produtos/${rec.product.slug}`}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold px-3 py-2 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                            >
                              <ShoppingCart className="h-3.5 w-3.5" />
                              <span>Ver Onde Comprar</span>
                            </a>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-2 text-slate-400">
                        <AlertCircle className="h-8 w-8 text-amber-500 mx-auto" />
                        <p className="text-sm font-semibold">Nenhum produto atinge a pontuação mínima.</p>
                        <p className="text-xs text-slate-500">Tente aumentar seu orçamento máximo ou ajustar os filtros de marca.</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleRestart}
                    className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Responder Novamente</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
