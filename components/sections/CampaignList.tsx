'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import Link from 'next/link';
import { CampaignPreview } from '@/types/GameBoardTypes';
import { doc, getDoc } from '@firebase/firestore';
import db from '@/app/firebase';
import { useToast } from '@/components/ui/use-toast';

const CampaignList = (props: { campaignIds: string[] }) => {
  const { toast } = useToast();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [campaignPreviews, setCampaignPreviews] = useState<
    CampaignPreview[] | null
  >(null);

  useEffect(() => {
    try {
      const fetchCampaignPreviews = async (campaignIds: string[]) => {
        let campaignPreviews = [];
        for (const id of campaignIds) {
          const docRef = doc(db, 'campaigns', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            campaignPreviews.push({
              id: id,
              title: docSnap.data().title,
              description: docSnap.data().description,
            });
          }
        }
        setCampaignPreviews(campaignPreviews);
      };
      fetchCampaignPreviews(props.campaignIds);
    } catch (e) {
      console.error(e);
      toast({
        title: 'Critical Fail',
        description: 'An error occurred while loading your campaigns.',
      });
    }
  }, [props.campaignIds]);

  return (
    <div className="max-w-5xl mx-auto px-8">
      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-10">
        {_.map(campaignPreviews, (preview, index) => (
          <Link href={`/${preview.id}`} key={index}>
            <div
              className="relative group  block p-2 h-full w-full "
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.span
                    className="absolute inset-0 h-full w-full bg-slate-800/[0.8] block  rounded-3xl"
                    layoutId="hoverBackground"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { duration: 0.15 },
                    }}
                    exit={{
                      opacity: 0,
                      transition: {
                        duration: 0.15,
                        delay: 0.2,
                      },
                    }}
                  />
                )}
              </AnimatePresence>
              <div className=" rounded-2xl h-full w-full p-4 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-800/[0.2] border border-transparent group-hover:border-slate-700 relative z-50">
                <div className="relative z-50">
                  <div className="p-4">
                    <h4 className="text-zinc-100 font-bold tracking-wide mt-4">
                      {preview.title}
                    </h4>
                    <p className="mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm">
                      {_.get(preview, 'description', '')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CampaignList;
