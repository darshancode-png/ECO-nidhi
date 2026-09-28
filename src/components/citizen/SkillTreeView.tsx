import React from 'react';
import { useGame } from '../../context/GameContext';
import {
  GitBranch,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Zap,
  Eye,
  Cpu,
  Activity,
  Map,
  TrendingUp
} from 'lucide-react';

export const SkillTreeView: React.FC = () => {
  const { skills, user, unlockSkill, navigate } = useGame();

  const getBranchIcon = (iconName: string) => {
    switch (iconName) {
      case 'zap': return <Zap className="w-5 h-5 text-amber-600" />;
      case 'eye': return <Eye className="w-5 h-5 text-teal-600" />;
      case 'cpu': return <Cpu className="w-5 h-5 text-emerald-600" />;
      case 'activity': return <Activity className="w-5 h-5 text-sky-600" />;
      case 'map': return <Map className="w-5 h-5 text-indigo-600" />;
      case 'trending-up': return <TrendingUp className="w-5 h-5 text-orange-600" />;
      default: return <Sparkles className="w-5 h-5 text-emerald-600" />;
    }
  };

  const branches = ['Sorting', 'Technology', 'Logistics', 'Economy'] as const;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-24 space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl text-emerald-800 font-semibold text-xs font-mono-numbers">
          <GitBranch className="w-4 h-4" />
          <span>{user.skillPoints} Skill Points Available</span>
        </div>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
          Eco Skill Tree & Perks
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md">
          Spend skill points earned from leveling up to unlock permanent passive perks across waste sorting, AI scans, and plant speed.
        </p>
      </div>

      {/* Branches */}
      <div className="space-y-5">
        {branches.map((branch) => {
          const branchSkills = skills.filter((s) => s.branch === branch);

          return (
            <div
              key={branch}
              className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-display font-bold text-slate-900 text-base">
                  {branch} Specialization
                </h3>
                <span className="text-xs text-slate-500 font-mono-numbers">
                  {branchSkills.filter((s) => s.unlocked).length} / {branchSkills.length} Unlocked
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {branchSkills.map((skill) => {
                  const canUnlock =
                    !skill.unlocked &&
                    user.skillPoints >= skill.cost &&
                    user.level >= skill.requiredLevel;

                  return (
                    <div
                      key={skill.id}
                      className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                        skill.unlocked
                          ? 'bg-emerald-50/60 border-emerald-300'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                            {getBranchIcon(skill.icon)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">
                              {skill.name}
                            </div>
                            <span className="text-[10px] text-emerald-700 font-semibold font-mono-numbers">
                              {skill.bonus}
                            </span>
                          </div>
                        </div>

                        {skill.unlocked ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono-numbers">
                            L{skill.requiredLevel}+
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-snug">
                        {skill.description}
                      </p>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-mono-numbers">
                          Cost: {skill.cost} Pt{skill.cost > 1 ? 's' : ''}
                        </span>

                        {skill.unlocked ? (
                          <span className="text-xs font-semibold text-emerald-800">
                            Active
                          </span>
                        ) : (
                          <button
                            onClick={() => unlockSkill(skill.id)}
                            disabled={!canUnlock}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono-numbers transition-all cursor-pointer ${
                              canUnlock
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-95'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            Unlock Perk
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
