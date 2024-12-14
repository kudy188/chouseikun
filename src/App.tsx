import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Printer,
  Monitor,
  Shield,
  Network,
  Briefcase,
} from 'lucide-react';

interface UsageData {
  metrics: {
    name: string;
    value: string;
    unit: string;
  }[];
}

interface CrossSellStage {
  id: string;
  name: string;
  icon: JSX.Element;
  challengeScore: number;
  isImplemented: boolean;
  usageData?: UsageData;
  challenges: string[];
  recommendations: string[];
}

const mockCrossSellStages: { [key: string]: CrossSellStage[] } = {
  '1': [
    {
      id: 'mfp',
      name: '複合機',
      icon: <Printer className="w-8 h-8 text-blue-600" />,
      challengeScore: 85,
      isImplemented: true,
      challenges: ['印刷コストの最適化が必要', '複数拠点での印刷管理が非効率'],
      recommendations: ['クラウド印刷管理システムの導入', 'ペーパーレス化の推進'],
      usageData: {
        metrics: [
          { name: 'プリント枚数', value: '15,000', unit: '枚/月' },
          { name: 'スキャン枚数', value: '8,000', unit: '枚/月' },
          { name: 'カラー比率', value: '45', unit: '%' },
          { name: '両面印刷率', value: '60', unit: '%' },
          { name: '設置台数', value: '5', unit: '台' }
        ]
      }
    },
    {
      id: 'pc',
      name: 'PC',
      icon: <Monitor className="w-8 h-8 text-blue-600" />,
      challengeScore: 75,
      isImplemented: true,
      challenges: ['端末の老朽化', 'セキュアなリモートワーク環境の整備'],
      recommendations: ['最新PCの一括導入', 'クラウドデスクトップの検討'],
      usageData: {
        metrics: [
          { name: 'PC台数', value: '120', unit: '台' },
          { name: 'Windows11導入率', value: '35', unit: '%' },
          { name: '平均使用年数', value: '4.2', unit: '年' },
          { name: 'モバイルPC比率', value: '40', unit: '%' }
        ]
      }
    },
    {
      id: 'security',
      name: 'セキュリティ',
      icon: <Shield className="w-8 h-8 text-red-600" />,
      challengeScore: 65,
      isImplemented: false,
      challenges: ['セキュリティポリシーの統一が必要', 'マルウェア対策の強化'],
      recommendations: ['統合セキュリティ管理の導入', 'エンドポイント保護の強化'],
      usageData: {
        metrics: [
          { name: 'セキュリティ事故', value: '2', unit: '件/年' },
          { name: 'パッチ適用率', value: '85', unit: '%' },
          { name: 'EDR導入率', value: '60', unit: '%' },
          { name: 'セキュリティ研修実施率', value: '75', unit: '%' }
        ]
      }
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
  '2': [
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
  '3': [
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
  '4': [
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
  '5': [
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
  '6': [
    {
      id: 'mfp',
      name: '複合機',
      icon: <Printer className="w-8 h-8 text-gray-600" />,
      challengeScore: 60,
      isImplemented: true,
      usageData: {
        metrics: [
          { name: 'プリント枚数', value: '12,000', unit: '枚/月' },
          { name: 'スキャン枚数', value: '7,000', unit: '枚/月' },
          { name: 'カラー比率', value: '40', unit: '%' },
          { name: '両面印刷率', value: '45', unit: '%' },
          { name: '設置台数', value: '4', unit: '台' }
        ]
      },
      challenges: ['効率的な文書管理', 'コスト削減'],
      recommendations: ['文書管理システム', 'プリント最適化']
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
  '7': [
    {
      id: 'mfp',
      name: '複合機',
      icon: <Printer className="w-8 h-8 text-gray-600" />,
      challengeScore: 75,
      isImplemented: true,
      usageData: {
        metrics: [
          { name: 'プリント枚数', value: '28,000', unit: '枚/月' },
          { name: 'スキャン枚数', value: '18,000', unit: '枚/月' },
          { name: 'カラー比率', value: '58', unit: '%' },
          { name: '両面印刷率', value: '65', unit: '%' },
          { name: '設置台数', value: '9', unit: '台' }
        ]
      },
      challenges: ['文書セキュリティ', '運用効率化'],
      recommendations: ['セキュアプリント', 'ワークフロー改善']
    },
    {
      id: 'pc',
      name: 'PC',
      icon: <Monitor className="w-8 h-8 text-gray-600" />,
      challengeScore: 85,
      isImplemented: true,
      usageData: {
        metrics: [
          { name: 'PC台数', value: '320', unit: '台' },
          { name: 'Windows11導入率', value: '60', unit: '%' },
          { name: '平均使用年数', value: '2.5', unit: '年' },
          { name: 'モバイルPC比率', value: '75', unit: '%' }
        ]
      },
      challenges: ['IT資産管理', 'セキュリティ対策'],
      recommendations: ['資産管理システム', 'セキュリティ強化']
    },
    {
      id: 'security',
      name: 'セキュリティ',
      icon: <Shield className="w-8 h-8 text-gray-600" />,
      challengeScore: 80,
      isImplemented: true,
      usageData: {
        metrics: [
          { name: 'セキュリティ事故', value: '0', unit: '件/年' },
          { name: 'パッチ適用率', value: '95', unit: '%' },
          { name: 'EDR導入率', value: '90', unit: '%' },
          { name: 'セキュリティ研修実施率', value: '95', unit: '%' }
        ]
      },
      challenges: ['セキュリティ維持', '新規脅威対策'],
      recommendations: ['AI活用セキュリティ', '脅威インテリジェンス']
    },
    {
      id: 'infrastructure',
      name: 'ITインフラ全体',
      icon: <Network className="w-8 h-8 text-gray-600" />,
      challengeScore: 70,
      isImplemented: true,
      usageData: {
        metrics: [
          { name: 'サーバー台数', value: '25', unit: '台' },
          { name: 'クラウド移行率', value: '60', unit: '%' },
          { name: 'ネットワーク稼働率', value: '99.9', unit: '%' },
          { name: 'システム連携数', value: '20', unit: '件' }
        ]
      },
      challenges: ['クラウド最適化', 'システム統合'],
      recommendations: ['マルチクラウド戦略', 'API統合']
    },
    {
      id: 'solutions',
      name: '業務・業種特化ソリューション',
      icon: <Briefcase className="w-8 h-8 text-gray-600" />,
      challengeScore: 65,
      isImplemented: true,
      usageData: {
        metrics: [
          { name: '基幹システム経過年数', value: '3', unit: '年' },
          { name: 'デジタル化率', value: '70', unit: '%' },
          { name: '業務自動化率', value: '55', unit: '%' },
          { name: 'データ活用度', value: '65', unit: '%' }
        ]
      },
      challenges: ['データ活用促進', 'AI導入検討'],
      recommendations: ['BI導入', 'AI活用戦略']
    }
  ],
  '8': [
    {
      id: 'mfp',
      name: '複合機',
      icon: <Printer className="w-8 h-8 text-gray-600" />,
      challengeScore: 90,
      isImplemented: true,
      usageData: {
        metrics: [
          { name: 'プリント枚数', value: '35,000', unit: '枚/月' },
          { name: 'スキャン枚数', value: '25,000', unit: '枚/月' },
          { name: 'カラー比率', value: '70', unit: '%' },
          { name: '両面印刷率', value: '75', unit: '%' },
          { name: '設置台数', value: '15', unit: '台' }
        ]
      },
      challenges: ['大規模印刷管理', 'コスト最適化'],
      recommendations: ['統合印刷管理', 'コスト分析']
    },
    {
      id: 'pc',
      name: 'PC',
      icon: <Monitor className="w-8 h-8 text-gray-600" />,
      challengeScore: 90,
      isImplemented: true,
      usageData: {
        metrics: [
          { name: 'PC台数', value: '450', unit: '台' },
          { name: 'Windows11導入率', value: '75', unit: '%' },
          { name: '平均使用年数', value: '2.2', unit: '年' },
          { name: 'モバイルPC比率', value: '85', unit: '%' }
        ]
      },
      challenges: ['IT資産最適化', 'ハイブリッドワーク'],
      recommendations: ['資産管理高度化', 'ワークスタイル改革']
    },
    {
      id: 'security',
      name: 'セキュリティ',
      icon: <Shield className="w-8 h-8 text-gray-600" />,
      challengeScore: 85,
      isImplemented: true,
      usageData: {
        metrics: [
          { name: 'セキュリティ事故', value: '0', unit: '件/年' },
          { name: 'パッチ適用率', value: '98', unit: '%' },
          { name: 'EDR導入率', value: '100', unit: '%' },
          { name: 'セキュリティ研修実施率', value: '100', unit: '%' }
        ]
      },
      challenges: ['先進的対策', 'セキュリティ文化'],
      recommendations: ['ゼロトラスト', 'セキュリティ認証']
    },
    {
      id: 'infrastructure',
      name: 'ITインフラ全体',
      icon: <Network className="w-8 h-8 text-gray-600" />,
      challengeScore: 80,
      isImplemented: true,
      usageData: {
        metrics: [
          { name: 'サーバー台数', value: '35', unit: '台' },
          { name: 'クラウド移行率', value: '80', unit: '%' },
          { name: 'ネットワーク稼働率', value: '99.99', unit: '%' },
          { name: 'システム連携数', value: '30', unit: '件' }
        ]
      },
      challenges: ['デジタル変革', 'システム連携'],
      recommendations: ['DX推進', 'API経済参画']
    },
    {
      id: 'solutions',
      name: '業務・業種特化ソリューション',
      icon: <Briefcase className="w-8 h-8 text-gray-600" />,
      challengeScore: 75,
      isImplemented: true,
      usageData: {
        metrics: [
          { name: '基幹システム経過年数', value: '2', unit: '年' },
          { name: 'デジタル化率', value: '85', unit: '%' },
          { name: '業務自動化率', value: '70', unit: '%' },
          { name: 'データ活用度', value: '80', unit: '%' }
        ]
      },
      challenges: ['AI活用拡大', 'データ戦略'],
      recommendations: ['AI導入', 'データ基盤構築']
    }
  ],
  '9': [
    {
      id: 'mfp',
      name: '複合機',
      icon: <Printer className="w-8 h-8 text-gray-600" />,
      challengeScore: 80,
      isImplemented: true,
      usageData: {
        metrics: [
          { name: 'プリント枚数', value: '20,000', unit: '枚/月' },
          { name: 'スキャン枚数', value: '13,000', unit: '枚/月' },
          { name: 'カラー比率', value: '52', unit: '%' },
          { name: '両面印刷率', value: '58', unit: '%' },
          { name: '設置台数', value: '7', unit: '台' }
        ]
      },
      challenges: ['文書管理効率化', 'セキュリティ強化'],
      recommendations: ['文書管理システム', 'セキュアプリント']
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
  '10': [
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
      challenges: ['印刷インフラ導入', 'ペーパーレス化検討'],
      recommendations: ['複合機導入', 'デジタル化推進']
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
  ]
};

export default function App() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">クロスセル支援システム</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(mockCrossSellStages).map(([companyId, stages]) => (
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
              {stages.map((stage) => (
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
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
