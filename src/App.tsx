import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Printer, Monitor, Shield, Network, Briefcase } from 'lucide-react';

interface Metric {
  name: string;
  value: string;
  unit: string;
}

interface UsageData {
  metrics: Metric[];
}

interface CrossSellStage {
  id: string;
  name: string;
  icon: React.ReactNode;
  challengeScore: number;
  isImplemented: boolean;
  usageData: UsageData;
  challenges: string[];
  recommendations: string[];
}

interface SuccessCase {
  companyName: string;
  industry: string;
  solution: string;
  sales: string;
  profit: string;
  result: string;
}

interface CompanyData {
  stages: CrossSellStage[];
  successCases: SuccessCase[];
}

const mockCrossSellStages: { [key: string]: CompanyData } = {
  '1': {
    stages: [
      {
        id: 'mfp',
        name: '複合機',
        icon: <Printer className="w-8 h-8 text-gray-600" />,
        challengeScore: 85,
        isImplemented: true,
        usageData: {
          metrics: [
            { name: 'プリント枚数', value: '25,000', unit: '枚/月' },
            { name: 'スキャン枚数', value: '18,000', unit: '枚/月' },
            { name: 'カラー比率', value: '65', unit: '%' },
            { name: '両面印刷率', value: '60', unit: '%' },
            { name: '設置台数', value: '10', unit: '台' }
          ]
        },
        challenges: ['文書管理効率化', 'コスト最適化'],
        recommendations: ['統合文書管理', 'コスト分析']
      },
      {
        id: 'pc',
        name: 'PC',
        icon: <Monitor className="w-8 h-8 text-gray-600" />,
        challengeScore: 75,
        isImplemented: true,
        usageData: {
          metrics: [
            { name: 'PC台数', value: '120', unit: '台' },
            { name: 'Windows11導入率', value: '35', unit: '%' },
            { name: '平均使用年数', value: '4.2', unit: '年' },
            { name: 'モバイルPC比率', value: '40', unit: '%' }
          ]
        },
        challenges: ['端末の老朽化', 'セキュアなリモートワーク環境の整備'],
        recommendations: ['最新PCの一括導入', 'クラウドデスクトップの検討']
      },
      {
        id: 'security',
        name: 'セキュリティ',
        icon: <Shield className="w-8 h-8 text-gray-600" />,
        challengeScore: 65,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: 'セキュリティ事故', value: '2', unit: '件/年' },
            { name: 'パッチ適用率', value: '85', unit: '%' },
            { name: 'EDR導入率', value: '60', unit: '%' },
            { name: 'セキュリティ研修実施率', value: '75', unit: '%' }
          ]
        },
        challenges: ['セキュリティポリシーの統一が必要', 'マルウェア対策の強化'],
        recommendations: ['統合セキュリティ管理の導入', 'エンドポイント保護の強化']
      },
      {
        id: 'infrastructure',
        name: 'ITインフラ全体',
        icon: <Network className="w-8 h-8 text-gray-600" />,
        challengeScore: 55,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: 'サーバー台数', value: '12', unit: '台' },
            { name: 'クラウド移行率', value: '30', unit: '%' },
            { name: 'ネットワーク稼働率', value: '99.5', unit: '%' },
            { name: 'システム連携数', value: '8', unit: '件' }
          ]
        },
        challenges: ['システム間連携の非効率', 'クラウド活用の遅れ'],
        recommendations: ['統合管理基盤の構築', 'クラウド移行計画の策定']
      },
      {
        id: 'solutions',
        name: '業務・業種特化ソリューション',
        icon: <Briefcase className="w-8 h-8 text-gray-600" />,
        challengeScore: 45,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: '基幹システム経過年数', value: '8', unit: '年' },
            { name: 'デジタル化率', value: '40', unit: '%' },
            { name: '業務自動化率', value: '25', unit: '%' },
            { name: 'データ活用度', value: '30', unit: '%' }
          ]
        },
        challenges: ['業務プロセスのデジタル化遅延', '部門間連携の非効率'],
        recommendations: ['業種特化型システムの導入', 'ワークフロー自動化の推進']
      }
    ],
    successCases: [
      {
        companyName: "株式会社テックソリューション",
        industry: "IT・通信",
        solution: "複合機・セキュリティ統合管理",
        sales: "5000万円",
        profit: "2000万円",
        result: "印刷コスト30%削減、セキュリティインシデント0件"
      },
      {
        companyName: "グローバルコンサルティング株式会社",
        industry: "コンサルティング",
        solution: "複合機・クラウド連携",
        sales: "3500万円",
        profit: "1400万円",
        result: "業務効率化により生産性20%向上"
      }
    ]
  },
  '2': {
    stages: [
      {
        id: 'mfp',
        name: '複合機',
        icon: <Printer className="w-8 h-8 text-blue-600" />,
        challengeScore: 82,
        isImplemented: true,
        usageData: {
          metrics: [
            { name: 'プリント枚数', value: '22,000', unit: '枚/月' },
            { name: 'スキャン枚数', value: '12,000', unit: '枚/月' },
            { name: 'カラー比率', value: '55', unit: '%' },
            { name: '両面印刷率', value: '45', unit: '%' },
            { name: '設置台数', value: '8', unit: '台' }
          ]
        },
        challenges: ['印刷コスト削減', 'ペーパーレス推進'],
        recommendations: ['印刷管理システム', 'デジタル文書管理']
      },
      {
        id: 'pc',
        name: 'PC',
        icon: <Monitor className="w-8 h-8 text-blue-600" />,
        challengeScore: 78,
        isImplemented: true,
        usageData: {
          metrics: [
            { name: 'PC台数', value: '150', unit: '台' },
            { name: 'Windows11導入率', value: '40', unit: '%' },
            { name: '平均使用年数', value: '3.8', unit: '年' },
            { name: 'モバイルPC比率', value: '50', unit: '%' }
          ]
        },
        challenges: ['PC管理の効率化', 'セキュリティ対策強化'],
        recommendations: ['一元管理ツール導入', 'セキュリティ監視']
      },
      {
        id: 'security',
        name: 'セキュリティ',
        icon: <Shield className="w-8 h-8 text-red-600" />,
        challengeScore: 70,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: 'セキュリティ事故', value: '3', unit: '件/年' },
            { name: 'パッチ適用率', value: '80', unit: '%' },
            { name: 'EDR導入率', value: '55', unit: '%' },
            { name: 'セキュリティ研修実施率', value: '70', unit: '%' }
          ]
        },
        challenges: ['エンドポイントセキュリティ強化', 'ユーザー教育'],
        recommendations: ['EDR導入', 'セキュリティトレーニング']
      },
      {
        id: 'infrastructure',
        name: 'ITインフラ全体',
        icon: <Network className="w-8 h-8 text-gray-600" />,
        challengeScore: 60,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: 'サーバー台数', value: '15', unit: '台' },
            { name: 'クラウド移行率', value: '35', unit: '%' },
            { name: 'ネットワーク稼働率', value: '99.7', unit: '%' },
            { name: 'システム連携数', value: '10', unit: '件' }
          ]
        },
        challenges: ['システム間連携の非効率', 'クラウド活用の遅れ'],
        recommendations: ['統合管理基盤の構築', 'クラウド移行計画の策定']
      },
      {
        id: 'solutions',
        name: '業務・業種特化ソリューション',
        icon: <Briefcase className="w-8 h-8 text-gray-600" />,
        challengeScore: 50,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: '基幹システム経過年数', value: '7', unit: '年' },
            { name: 'デジタル化率', value: '45', unit: '%' },
            { name: '業務自動化率', value: '30', unit: '%' },
            { name: 'データ活用度', value: '35', unit: '%' }
          ]
        },
        challenges: ['業務プロセスのデジタル化遅延', '部門間連携の非効率'],
        recommendations: ['業種特化型システムの導入', 'ワークフロー自動化の推進']
      }
    ],
    successCases: [
      {
        companyName: "製造テクノロジー株式会社",
        industry: "製造業",
        solution: "複合機・生産管理システム連携",
        sales: "4800万円",
        profit: "1900万円",
        result: "生産管理効率35%向上、ペーパーレス化達成"
      },
      {
        companyName: "物流システム株式会社",
        industry: "物流",
        solution: "複合機・在庫管理システム",
        sales: "3800万円",
        profit: "1500万円",
        result: "在庫管理時間40%削減、出荷精度向上"
      }
    ]
  },
  '3': {
    stages: [
      {
        id: 'mfp',
        name: '複合機',
        icon: <Printer className="w-8 h-8 text-gray-600" />,
        challengeScore: 65,
        isImplemented: true,
        usageData: {
          metrics: [
            { name: 'プリント枚数', value: '18,000', unit: '枚/月' },
            { name: 'スキャン枚数', value: '9,500', unit: '枚/月' },
            { name: 'カラー比率', value: '50', unit: '%' },
            { name: '両面印刷率', value: '55', unit: '%' },
            { name: '設置台数', value: '6', unit: '台' }
          ]
        },
        challenges: ['印刷コスト最適化', 'ワークフロー効率化'],
        recommendations: ['印刷管理システム', '文書管理システム']
      },
      {
        id: 'pc',
        name: 'PC',
        icon: <Monitor className="w-8 h-8 text-gray-600" />,
        challengeScore: 70,
        isImplemented: true,
        usageData: {
          metrics: [
            { name: 'PC台数', value: '85', unit: '台' },
            { name: 'Windows11導入率', value: '30', unit: '%' },
            { name: '平均使用年数', value: '3.5', unit: '年' },
            { name: 'モバイルPC比率', value: '35', unit: '%' }
          ]
        },
        challenges: ['PC管理効率化', 'セキュリティ対策'],
        recommendations: ['管理ツール導入', 'セキュリティ強化']
      },
      {
        id: 'security',
        name: 'セキュリティ',
        icon: <Shield className="w-8 h-8 text-gray-600" />,
        challengeScore: 55,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: 'セキュリティ事故', value: '4', unit: '件/年' },
            { name: 'パッチ適用率', value: '75', unit: '%' },
            { name: 'EDR導入率', value: '40', unit: '%' },
            { name: 'セキュリティ研修実施率', value: '60', unit: '%' }
          ]
        },
        challenges: ['エンドポイント保護', 'セキュリティ教育'],
        recommendations: ['EDR導入', '定期研修実施']
      },
      {
        id: 'infrastructure',
        name: 'ITインフラ全体',
        icon: <Network className="w-8 h-8 text-gray-600" />,
        challengeScore: 50,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: 'サーバー台数', value: '8', unit: '台' },
            { name: 'クラウド移行率', value: '25', unit: '%' },
            { name: 'ネットワーク稼働率', value: '99.3', unit: '%' },
            { name: 'システム連携数', value: '5', unit: '件' }
          ]
        },
        challenges: ['クラウド活用', 'システム連携'],
        recommendations: ['クラウド移行', '統合管理']
      },
      {
        id: 'solutions',
        name: '業務・業種特化ソリューション',
        icon: <Briefcase className="w-8 h-8 text-gray-600" />,
        challengeScore: 40,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: '基幹システム経過年数', value: '6', unit: '年' },
            { name: 'デジタル化率', value: '35', unit: '%' },
            { name: '業務自動化率', value: '20', unit: '%' },
            { name: 'データ活用度', value: '25', unit: '%' }
          ]
        },
        challenges: ['業務効率化', 'デジタル化推進'],
        recommendations: ['業務システム刷新', 'データ活用促進']
      }
    ],
    successCases: [
      {
        companyName: "金融ソリューション株式会社",
        industry: "金融",
        solution: "複合機・セキュアプリント",
        sales: "6000万円",
        profit: "2400万円",
        result: "情報セキュリティ強化、コンプライアンス遵守率100%"
      },
      {
        companyName: "証券システム株式会社",
        industry: "金融",
        solution: "複合機・ワークフロー自動化",
        sales: "5500万円",
        profit: "2200万円",
        result: "業務処理時間45%削減、エラー率80%減少"
      }
    ]
  },
  '4': {
    stages: [
      {
        id: 'mfp',
        name: '複合機',
        icon: <Printer className="w-8 h-8 text-gray-600" />,
        challengeScore: 70,
        isImplemented: true,
        usageData: {
          metrics: [
            { name: 'プリント枚数', value: '25,000', unit: '枚/月' },
            { name: 'スキャン枚数', value: '15,000', unit: '枚/月' },
            { name: 'カラー比率', value: '60', unit: '%' },
            { name: '両面印刷率', value: '50', unit: '%' },
            { name: '設置台数', value: '10', unit: '台' }
          ]
        },
        challenges: ['印刷コスト削減', 'セキュリティ強化'],
        recommendations: ['セキュアプリント', '文書暗号化']
      },
      {
        id: 'pc',
        name: 'PC',
        icon: <Monitor className="w-8 h-8 text-gray-600" />,
        challengeScore: 80,
        isImplemented: true,
        usageData: {
          metrics: [
            { name: 'PC台数', value: '180', unit: '台' },
            { name: 'Windows11導入率', value: '45', unit: '%' },
            { name: '平均使用年数', value: '3.2', unit: '年' },
            { name: 'モバイルPC比率', value: '55', unit: '%' }
          ]
        },
        challenges: ['PC管理の統合', 'モバイルワーク対応'],
        recommendations: ['統合管理システム', 'セキュアアクセス']
      },
      {
        id: 'security',
        name: 'セキュリティ',
        icon: <Shield className="w-8 h-8 text-gray-600" />,
        challengeScore: 65,
        isImplemented: true,
        usageData: {
          metrics: [
            { name: 'セキュリティ事故', value: '1', unit: '件/年' },
            { name: 'パッチ適用率', value: '90', unit: '%' },
            { name: 'EDR導入率', value: '75', unit: '%' },
            { name: 'セキュリティ研修実施率', value: '85', unit: '%' }
          ]
        },
        challenges: ['セキュリティ強化', '従業員教育'],
        recommendations: ['EDR完全導入', '定期研修']
      },
      {
        id: 'infrastructure',
        name: 'ITインフラ全体',
        icon: <Network className="w-8 h-8 text-gray-600" />,
        challengeScore: 45,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: 'サーバー台数', value: '15', unit: '台' },
            { name: 'クラウド移行率', value: '20', unit: '%' },
            { name: 'ネットワーク稼働率', value: '99.1', unit: '%' },
            { name: 'システム連携数', value: '12', unit: '件' }
          ]
        },
        challenges: ['インフラ最適化', 'クラウド移行'],
        recommendations: ['クラウド戦略', 'システム統合']
      },
      {
        id: 'solutions',
        name: '業務・業種特化ソリューション',
        icon: <Briefcase className="w-8 h-8 text-gray-600" />,
        challengeScore: 35,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: '基幹システム経過年数', value: '9', unit: '年' },
            { name: 'デジタル化率', value: '30', unit: '%' },
            { name: '業務自動化率', value: '15', unit: '%' },
            { name: 'データ活用度', value: '20', unit: '%' }
          ]
        },
        challenges: ['業務効率改善', 'デジタル化'],
        recommendations: ['業務改革', 'データ活用']
      }
    ],
    successCases: [
      {
        companyName: "スタートアップ株式会社",
        industry: "IT・通信",
        solution: "複合機導入支援",
        sales: "2500万円",
        profit: "1000万円",
        result: "ペーパーレス化推進、業務効率25%向上"
      },
      {
        companyName: "ベンチャーテック株式会社",
        industry: "IT・通信",
        solution: "デジタルワークフロー",
        sales: "2000万円",
        profit: "800万円",
        result: "リモートワーク環境整備、生産性20%向上"
      }
    ]
  },
  '5': {
    stages: [
      {
        id: 'mfp',
        name: '複合機',
        icon: <Printer className="w-8 h-8 text-gray-600" />,
        challengeScore: 85,
        isImplemented: true,
        usageData: {
          metrics: [
            { name: 'プリント枚数', value: '30,000', unit: '枚/月' },
            { name: 'スキャン枚数', value: '20,000', unit: '枚/月' },
            { name: 'カラー比率', value: '65', unit: '%' },
            { name: '両面印刷率', value: '70', unit: '%' },
            { name: '設置台数', value: '12', unit: '台' }
          ]
        },
        challenges: ['大量印刷の最適化', 'コスト管理'],
        recommendations: ['高速プリンタ導入', 'コスト分析システム']
      },
      {
        id: 'pc',
        name: 'PC',
        icon: <Monitor className="w-8 h-8 text-gray-600" />,
        challengeScore: 75,
        isImplemented: true,
        usageData: {
          metrics: [
            { name: 'PC台数', value: '250', unit: '台' },
            { name: 'Windows11導入率', value: '50', unit: '%' },
            { name: '平均使用年数', value: '2.8', unit: '年' },
            { name: 'モバイルPC比率', value: '65', unit: '%' }
          ]
        },
        challenges: ['PC管理効率化', 'セキュリティ強化'],
        recommendations: ['一元管理システム', 'エンドポイント保護']
      },
      {
        id: 'security',
        name: 'セキュリティ',
        icon: <Shield className="w-8 h-8 text-gray-600" />,
        challengeScore: 70,
        isImplemented: true,
        usageData: {
          metrics: [
            { name: 'セキュリティ事故', value: '2', unit: '件/年' },
            { name: 'パッチ適用率', value: '88', unit: '%' },
            { name: 'EDR導入率', value: '80', unit: '%' },
            { name: 'セキュリティ研修実施率', value: '90', unit: '%' }
          ]
        },
        challenges: ['セキュリティ強化', '従業員教育'],
        recommendations: ['EDR完全導入', '定期研修']
      },
      {
        id: 'infrastructure',
        name: 'ITインフラ全体',
        icon: <Network className="w-8 h-8 text-gray-600" />,
        challengeScore: 60,
        isImplemented: true,
        usageData: {
          metrics: [
            { name: 'サーバー台数', value: '20', unit: '台' },
            { name: 'クラウド移行率', value: '45', unit: '%' },
            { name: 'ネットワーク稼働率', value: '99.8', unit: '%' },
            { name: 'システム連携数', value: '15', unit: '件' }
          ]
        },
        challenges: ['クラウド活用', 'システム連携'],
        recommendations: ['クラウド移行', '統合管理']
      },
      {
        id: 'solutions',
        name: '業務・業種特化ソリューション',
        icon: <Briefcase className="w-8 h-8 text-gray-600" />,
        challengeScore: 55,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: '基幹システム経過年数', value: '5', unit: '年' },
            { name: 'デジタル化率', value: '50', unit: '%' },
            { name: '業務自動化率', value: '35', unit: '%' },
            { name: 'データ活用度', value: '40', unit: '%' }
          ]
        },
        challenges: ['業務効率改善', 'デジタル化'],
        recommendations: ['業務改革', 'データ活用']
      }
    ],
    successCases: [
      {
        companyName: "テクノロジーパートナーズ株式会社",
        industry: "IT・通信",
        solution: "複合機・クラウド連携",
        sales: "3800万円",
        profit: "1500万円",
        result: "クラウド連携による業務効率40%向上"
      },
      {
        companyName: "グローバルコンサル株式会社",
        industry: "コンサルティング",
        solution: "複合機・ワークフロー改革",
        sales: "4500万円",
        profit: "1900万円",
        result: "ペーパーレス化達成、生産性35%向上"
      }
    ]
  },
  '6': {
    stages: [
      {
        id: 'mfp',
        name: '複合機',
        icon: <Printer className="w-8 h-8 text-gray-600" />,
        challengeScore: 88,
        isImplemented: true,
        usageData: {
          metrics: [
            { name: 'プリント枚数', value: '30,000', unit: '枚/月' },
            { name: 'スキャン枚数', value: '22,000', unit: '枚/月' },
            { name: 'カラー比率', value: '62', unit: '%' },
            { name: '両面印刷率', value: '70', unit: '%' },
            { name: '設置台数', value: '12', unit: '台' }
          ]
        },
        challenges: ['文書管理効率化', 'コスト最適化'],
        recommendations: ['統合文書管理', 'コスト分析']
      },
      {
        id: 'pc',
        name: 'PC',
        icon: <Monitor className="w-8 h-8 text-gray-600" />,
        challengeScore: 65,
        isImplemented: true,
        usageData: {
          metrics: [
            { name: 'PC台数', value: '95', unit: '台' },
            { name: 'Windows11導入率', value: '25', unit: '%' },
            { name: '平均使用年数', value: '4.5', unit: '年' },
            { name: 'モバイルPC比率', value: '30', unit: '%' }
          ]
        },
        challenges: ['PC更新計画', 'モバイル化推進'],
        recommendations: ['計画的更新', 'モバイルワーク環境整備']
      },
      {
        id: 'security',
        name: 'セキュリティ',
        icon: <Shield className="w-8 h-8 text-gray-600" />,
        challengeScore: 50,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: 'セキュリティ事故', value: '5', unit: '件/年' },
            { name: 'パッチ適用率', value: '70', unit: '%' },
            { name: 'EDR導入率', value: '30', unit: '%' },
            { name: 'セキュリティ研修実施率', value: '50', unit: '%' }
          ]
        },
        challenges: ['セキュリティ対策強化', '従業員教育'],
        recommendations: ['EDR導入', 'セキュリティ研修']
      },
      {
        id: 'infrastructure',
        name: 'ITインフラ全体',
        icon: <Network className="w-8 h-8 text-gray-600" />,
        challengeScore: 40,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: 'サーバー台数', value: '6', unit: '台' },
            { name: 'クラウド移行率', value: '15', unit: '%' },
            { name: 'ネットワーク稼働率', value: '98.5', unit: '%' },
            { name: 'システム連携数', value: '4', unit: '件' }
          ]
        },
        challenges: ['インフラ整備', 'クラウド活用'],
        recommendations: ['インフラ更新', 'クラウド検討']
      },
      {
        id: 'solutions',
        name: '業務・業種特化ソリューション',
        icon: <Briefcase className="w-8 h-8 text-gray-600" />,
        challengeScore: 30,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: '基幹システム経過年数', value: '10', unit: '年' },
            { name: 'デジタル化率', value: '25', unit: '%' },
            { name: '業務自動化率', value: '10', unit: '%' },
            { name: 'データ活用度', value: '15', unit: '%' }
          ]
        },
        challenges: ['システム刷新', 'デジタル化推進'],
        recommendations: ['基幹システム更新', '業務改革']
      }
    ],
    successCases: [
      {
        companyName: "医療システム株式会社",
        industry: "医療",
        solution: "複合機・電子カルテ連携",
        sales: "5800万円",
        profit: "2300万円",
        result: "診療記録電子化100%達成、検索時間80%削減"
      },
      {
        companyName: "ヘルスケアソリューション株式会社",
        industry: "医療",
        solution: "複合機・医療文書管理",
        sales: "4800万円",
        profit: "1900万円",
        result: "文書管理効率45%向上、患者待ち時間30%削減"
      }
    ]
  },
  '7': {
    stages: [
      {
        id: 'mfp',
        name: '複合機',
        icon: <Printer className="w-8 h-8 text-gray-600" />,
        challengeScore: 92,
        isImplemented: true,
        usageData: {
          metrics: [
            { name: 'プリント枚数', value: '40,000', unit: '枚/月' },
            { name: 'スキャン枚数', value: '28,000', unit: '枚/月' },
            { name: 'カラー比率', value: '68', unit: '%' },
            { name: '両面印刷率', value: '75', unit: '%' },
            { name: '設置台数', value: '18', unit: '台' }
          ]
        },
        challenges: ['大量印刷管理', 'コスト削減'],
        recommendations: ['印刷最適化', '運用改善']
      },
      {
        id: 'pc',
        name: 'PC',
        icon: <Monitor className="w-8 h-8 text-gray-600" />,
        challengeScore: 70,
        isImplemented: true,
        usageData: {
          metrics: [
            { name: 'PC台数', value: '150', unit: '台' },
            { name: 'Windows11導入率', value: '40', unit: '%' },
            { name: '平均使用年数', value: '3.8', unit: '年' },
            { name: 'モバイルPC比率', value: '45', unit: '%' }
          ]
        },
        challenges: ['PC管理効率化', 'セキュリティ強化'],
        recommendations: ['管理ツール導入', 'セキュリティ強化']
      },
      {
        id: 'security',
        name: 'セキュリティ',
        icon: <Shield className="w-8 h-8 text-gray-600" />,
        challengeScore: 60,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: 'セキュリティ事故', value: '3', unit: '件/年' },
            { name: 'パッチ適用率', value: '80', unit: '%' },
            { name: 'EDR導入率', value: '50', unit: '%' },
            { name: 'セキュリティ研修実施率', value: '70', unit: '%' }
          ]
        },
        challenges: ['エンドポイント保護', 'セキュリティ教育'],
        recommendations: ['EDR導入', '定期研修実施']
      },
      {
        id: 'infrastructure',
        name: 'ITインフラ全体',
        icon: <Network className="w-8 h-8 text-gray-600" />,
        challengeScore: 50,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: 'サーバー台数', value: '10', unit: '台' },
            { name: 'クラウド移行率', value: '30', unit: '%' },
            { name: 'ネットワーク稼働率', value: '99.0', unit: '%' },
            { name: 'システム連携数', value: '8', unit: '件' }
          ]
        },
        challenges: ['クラウド活用', 'システム連携'],
        recommendations: ['クラウド移行', '統合管理']
      },
      {
        id: 'solutions',
        name: '業務・業種特化ソリューション',
        icon: <Briefcase className="w-8 h-8 text-gray-600" />,
        challengeScore: 45,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: '基幹システム経過年数', value: '7', unit: '年' },
            { name: 'デジタル化率', value: '40', unit: '%' },
            { name: '業務自動化率', value: '25', unit: '%' },
            { name: 'データ活用度', value: '30', unit: '%' }
          ]
        },
        challenges: ['業務効率化', 'デジタル化推進'],
        recommendations: ['業務システム刷新', 'データ活用促進']
      }
    ],
    successCases: [
      {
        companyName: "教育ソリューション株式会社",
        industry: "教育",
        solution: "複合機・教育支援システム",
        sales: "4200万円",
        profit: "1700万円",
        result: "教材作成時間50%削減、学習効果30%向上"
      },
      {
        companyName: "学校ICT株式会社",
        industry: "教育",
        solution: "複合機・デジタル教材連携",
        sales: "3800万円",
        profit: "1500万円",
        result: "ペーパーレス化70%達成、教職員業務効率35%向上"
      }
    ]
  },
  '8': {
    stages: [
      {
        id: 'mfp',
        name: '複合機',
        icon: <Printer className="w-8 h-8 text-gray-600" />,
        challengeScore: 85,
        isImplemented: true,
        usageData: {
          metrics: [
            { name: 'プリント枚数', value: '25,000', unit: '枚/月' },
            { name: 'スキャン枚数', value: '20,000', unit: '枚/月' },
            { name: 'カラー比率', value: '72', unit: '%' },
            { name: '両面印刷率', value: '68', unit: '%' },
            { name: '設置台数', value: '8', unit: '台' }
          ]
        },
        challenges: ['デザイン品質', 'ワークフロー効率化'],
        recommendations: ['カラーマネジメント', 'ワークフロー改善']
      },
      {
        id: 'pc',
        name: 'PC',
        icon: <Monitor className="w-8 h-8 text-gray-600" />,
        challengeScore: 70,
        isImplemented: true,
        usageData: {
          metrics: [
            { name: 'PC台数', value: '150', unit: '台' },
            { name: 'Windows11導入率', value: '40', unit: '%' },
            { name: '平均使用年数', value: '3.8', unit: '年' },
            { name: 'モバイルPC比率', value: '45', unit: '%' }
          ]
        },
        challenges: ['PC管理効率化', 'セキュリティ強化'],
        recommendations: ['管理ツール導入', 'セキュリティ強化']
      },
      {
        id: 'security',
        name: 'セキュリティ',
        icon: <Shield className="w-8 h-8 text-gray-600" />,
        challengeScore: 60,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: 'セキュリティ事故', value: '3', unit: '件/年' },
            { name: 'パッチ適用率', value: '80', unit: '%' },
            { name: 'EDR導入率', value: '50', unit: '%' },
            { name: 'セキュリティ研修実施率', value: '70', unit: '%' }
          ]
        },
        challenges: ['エンドポイント保護', 'セキュリティ教育'],
        recommendations: ['EDR導入', '定期研修実施']
      },
      {
        id: 'infrastructure',
        name: 'ITインフラ全体',
        icon: <Network className="w-8 h-8 text-gray-600" />,
        challengeScore: 50,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: 'サーバー台数', value: '10', unit: '台' },
            { name: 'クラウド移行率', value: '30', unit: '%' },
            { name: 'ネットワーク稼働率', value: '99.0', unit: '%' },
            { name: 'システム連携数', value: '8', unit: '件' }
          ]
        },
        challenges: ['クラウド活用', 'システム連携'],
        recommendations: ['クラウド移行', '統合管理']
      },
      {
        id: 'solutions',
        name: '業務・業種特化ソリューション',
        icon: <Briefcase className="w-8 h-8 text-gray-600" />,
        challengeScore: 45,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: '基幹システム経過年数', value: '7', unit: '年' },
            { name: 'デジタル化率', value: '40', unit: '%' },
            { name: '業務自動化率', value: '25', unit: '%' },
            { name: 'データ活用度', value: '30', unit: '%' }
          ]
        },
        challenges: ['業務効率化', 'デジタル化推進'],
        recommendations: ['業務システム刷新', 'データ活用促進']
      }
    ],
    successCases: [
      {
        companyName: "クリエイティブエージェンシー株式会社",
        industry: "広告・デザイン",
        solution: "複合機・デザインワークフロー",
        sales: "3500万円",
        profit: "1400万円",
        result: "デザイン承認時間60%削減、品質精度向上"
      },
      {
        companyName: "デジタルクリエイト株式会社",
        industry: "広告・デザイン",
        solution: "複合機・クリエイティブ支援",
        sales: "3200万円",
        profit: "1300万円",
        result: "制作プロセス効率40%向上、顧客満足度向上"
      }
    ]
  },
  '9': {
    stages: [
      {
        id: 'mfp',
        name: '複合機',
        icon: <Printer className="w-8 h-8 text-gray-600" />,
        challengeScore: 78,
        isImplemented: true,
        usageData: {
          metrics: [
            { name: 'プリント枚数', value: '18,000', unit: '枚/月' },
            { name: 'スキャン枚数', value: '15,000', unit: '枚/月' },
            { name: 'カラー比率', value: '55', unit: '%' },
            { name: '両面印刷率', value: '62', unit: '%' },
            { name: '設置台数', value: '6', unit: '台' }
          ]
        },
        challenges: ['文書セキュリティ', '業務効率化'],
        recommendations: ['セキュアプリント', 'ワークフロー改善']
      },
      {
        id: 'pc',
        name: 'PC',
        icon: <Monitor className="w-8 h-8 text-gray-600" />,
        challengeScore: 50,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: 'PC台数', value: '0', unit: '台' },
            { name: 'Windows11導入率', value: '0', unit: '%' },
            { name: '平均使用年数', value: '0', unit: '年' },
            { name: 'モバイルPC比率', value: '0', unit: '%' }
          ]
        },
        challenges: ['PC導入計画', 'セキュリティ対策'],
        recommendations: ['PC導入', 'セキュリティ強化']
      },
      {
        id: 'security',
        name: 'セキュリティ',
        icon: <Shield className="w-8 h-8 text-gray-600" />,
        challengeScore: 40,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: 'セキュリティ事故', value: '0', unit: '件/年' },
            { name: 'パッチ適用率', value: '0', unit: '%' },
            { name: 'EDR導入率', value: '0', unit: '%' },
            { name: 'セキュリティ研修実施率', value: '0', unit: '%' }
          ]
        },
        challenges: ['セキュリティ対策', '従業員教育'],
        recommendations: ['EDR導入', '定期研修']
      },
      {
        id: 'infrastructure',
        name: 'ITインフラ全体',
        icon: <Network className="w-8 h-8 text-gray-600" />,
        challengeScore: 30,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: 'サーバー台数', value: '0', unit: '台' },
            { name: 'クラウド移行率', value: '0', unit: '%' },
            { name: 'ネットワーク稼働率', value: '0', unit: '%' },
            { name: 'システム連携数', value: '0', unit: '件' }
          ]
        },
        challenges: ['インフラ整備', 'クラウド活用'],
        recommendations: ['インフラ更新', 'クラウド検討']
      },
      {
        id: 'solutions',
        name: '業務・業種特化ソリューション',
        icon: <Briefcase className="w-8 h-8 text-gray-600" />,
        challengeScore: 20,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: '基幹システム経過年数', value: '0', unit: '年' },
            { name: 'デジタル化率', value: '0', unit: '%' },
            { name: '業務自動化率', value: '0', unit: '%' },
            { name: 'データ活用度', value: '0', unit: '%' }
          ]
        },
        challenges: ['業務効率化', 'デジタル化推進'],
        recommendations: ['業務システム刷新', 'データ活用促進']
      }
    ],
    successCases: [
      {
        companyName: "リーガルテック株式会社",
        industry: "法律",
        solution: "複合機・法務文書管理",
        sales: "4500万円",
        profit: "1800万円",
        result: "文書管理時間55%削減、セキュリティ強化"
      },
      {
        companyName: "士業ソリューション株式会社",
        industry: "専門サービス",
        solution: "複合機・業務効率化",
        sales: "3800万円",
        profit: "1500万円",
        result: "業務処理効率40%向上、顧客対応時間短縮"
      }
    ]
  },
  '10': {
    stages: [
      {
        id: 'mfp',
        name: '複合機',
        icon: <Printer className="w-8 h-8 text-gray-600" />,
        challengeScore: 95,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: 'プリント枚数', value: '0', unit: '枚/月' },
            { name: 'スキャン枚数', value: '0', unit: '枚/月' },
            { name: 'カラー比率', value: '0', unit: '%' },
            { name: '両面印刷率', value: '0', unit: '%' },
            { name: '設置台数', value: '0', unit: '台' }
          ]
        },
        challenges: ['印刷環境整備', 'デジタル化推進'],
        recommendations: ['複合機導入', 'ワークフロー構築']
      },
      {
        id: 'pc',
        name: 'PC',
        icon: <Monitor className="w-8 h-8 text-gray-600" />,
        challengeScore: 50,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: 'PC台数', value: '0', unit: '台' },
            { name: 'Windows11導入率', value: '0', unit: '%' },
            { name: '平均使用年数', value: '0', unit: '年' },
            { name: 'モバイルPC比率', value: '0', unit: '%' }
          ]
        },
        challenges: ['PC導入計画', 'セキュリティ対策'],
        recommendations: ['PC導入', 'セキュリティ強化']
      },
      {
        id: 'security',
        name: 'セキュリティ',
        icon: <Shield className="w-8 h-8 text-gray-600" />,
        challengeScore: 40,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: 'セキュリティ事故', value: '0', unit: '件/年' },
            { name: 'パッチ適用率', value: '0', unit: '%' },
            { name: 'EDR導入率', value: '0', unit: '%' },
            { name: 'セキュリティ研修実施率', value: '0', unit: '%' }
          ]
        },
        challenges: ['セキュリティ対策', '従業員教育'],
        recommendations: ['EDR導入', '定期研修']
      },
      {
        id: 'infrastructure',
        name: 'ITインフラ全体',
        icon: <Network className="w-8 h-8 text-gray-600" />,
        challengeScore: 30,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: 'サーバー台数', value: '0', unit: '台' },
            { name: 'クラウド移行率', value: '0', unit: '%' },
            { name: 'ネットワーク稼働率', value: '0', unit: '%' },
            { name: 'システム連携数', value: '0', unit: '件' }
          ]
        },
        challenges: ['インフラ整備', 'クラウド活用'],
        recommendations: ['インフラ更新', 'クラウド検討']
      },
      {
        id: 'solutions',
        name: '業務・業種特化ソリューション',
        icon: <Briefcase className="w-8 h-8 text-gray-600" />,
        challengeScore: 20,
        isImplemented: false,
        usageData: {
          metrics: [
            { name: '基幹システム経過年数', value: '0', unit: '年' },
            { name: 'デジタル化率', value: '0', unit: '%' },
            { name: '業務自動化率', value: '0', unit: '%' },
            { name: 'データ活用度', value: '0', unit: '%' }
          ]
        },
        challenges: ['業務効率化', 'デジタル化推進'],
        recommendations: ['業務システム刷新', 'データ活用促進']
      }
    ],
    successCases: [
      {
        companyName: "スタートアップイノベーション株式会社",
        industry: "IT・通信",
        solution: "複合機・業務基盤構築",
        sales: "2800万円",
        profit: "1100万円",
        result: "業務基盤確立、生産性30%向上"
      },
      {
        companyName: "テクノベンチャー株式会社",
        industry: "IT・通信",
        solution: "複合機・クラウド連携",
        sales: "2500万円",
        profit: "1000万円",
        result: "クラウドワークフロー確立、効率25%向上"
      }
    ]
  }
};

export default function App() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">クロスセル支援システム</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(mockCrossSellStages).map(([companyId, companyData]) => (
          <Card key={companyId} className={`${selectedCompany && selectedCompany !== companyId ? 'hidden' : ''}`}>
            <CardHeader>
              <CardTitle>企業 {companyId}</CardTitle>
              <CardDescription>
                {!selectedCompany && (
                  <button
                    onClick={() => setSelectedCompany(companyId)}
                    className="text-blue-600 hover:underline"
                  >
                    選択
                  </button>
                )}
                {selectedCompany === companyId && (
                  <button
                    onClick={() => setSelectedCompany(null)}
                    className="text-blue-600 hover:underline"
                  >
                    戻る
                  </button>
                )}
              </CardDescription>
            </CardHeader>

            <div className="p-4">
              {companyData.stages.map((stage) => (
                <div key={stage.id} className={`mb-4 ${!stage.isImplemented ? 'opacity-50' : ''}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {stage.icon}
                    <h3 className="font-semibold">{stage.name}</h3>
                  </div>

                  <Progress value={stage.challengeScore} className="mb-2" />

                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="text-sm text-blue-600 hover:underline">
                        詳細を表示
                      </button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="space-y-2">
                        <h4 className="font-semibold">利用状況</h4>
                        {stage.usageData?.metrics.map((metric, index) => (
                          <div key={index} className="text-sm">
                            {metric.name}: {metric.value}{metric.unit}
                          </div>
                        ))}

                        <h4 className="font-semibold mt-4">課題</h4>
                        <ul className="list-disc pl-4 text-sm">
                          {stage.challenges.map((challenge, index) => (
                            <li key={index}>{challenge}</li>
                          ))}
                        </ul>

                        <h4 className="font-semibold mt-4">推奨対策</h4>
                        <ul className="list-disc pl-4 text-sm">
                          {stage.recommendations.map((recommendation, index) => (
                            <li key={index}>{recommendation}</li>
                          ))}
                        </ul>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              ))}

              {selectedCompany === companyId && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-4">成功事例</h4>
                  {companyData.successCases.map((successCase, index) => (
                    <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium">{successCase.companyName}</div>
                      <div className="text-sm text-gray-600">{successCase.industry}</div>
                      <div className="mt-2">{successCase.solution}</div>
                      <div className="mt-2 text-sm">
                        <span className="text-green-600">売上: {successCase.sales}</span>
                        <span className="mx-2">|</span>
                        <span className="text-blue-600">粗利: {successCase.profit}</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-700">{successCase.result}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
