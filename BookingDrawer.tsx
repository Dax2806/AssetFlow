import React from 'react';
import { Asset } from '../../types';
import AssetCard from './AssetCard';
import { SkeletonCard } from './SkeletonState';
import EmptyState from '../common/EmptyState';
import { Laptop } from 'lucide-react';

interface AssetGridProps {
  assets: Asset[];
  isLoading: boolean;
  onOpenDetail: (asset: Asset) => void;
  onClearFilters: () => void;
}

export default function AssetGrid({ assets, isLoading, onOpenDetail, onClearFilters }: AssetGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          icon={Laptop}
          title="No assets match search parameters"
          description="Adjust your filters, clear search terms, or register a brand-new physical asset to get started."
          actionText="Reset All Filters"
          onAction={onClearFilters}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {assets.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </div>
  );
}
