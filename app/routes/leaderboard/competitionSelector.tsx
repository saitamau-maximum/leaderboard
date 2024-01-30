import { SelectBox } from "@saitamau-maximum/ui";

import styles from "./competitionSelector.module.css";

interface CompetitionSelectorProps {
  allCompetitions: {
    id: number;
    name: string;
  }[];
  selectedCompetitionId?: number;
  onSelectedCompetitionIdChange?: (id: number) => void;
}

export const CompetitionSelector = ({
  allCompetitions,
  selectedCompetitionId,
  onSelectedCompetitionIdChange,
}: CompetitionSelectorProps) => {
  return (
    <div className={styles.competitionSelector}>
      <SelectBox
        placeholder="大会を選択"
        options={allCompetitions.map((c) => ({
          label: c.name,
          value: `${c.id}`,
        }))}
        value={`${selectedCompetitionId}`}
        onValueChange={(v) => {
          if (onSelectedCompetitionIdChange) {
            onSelectedCompetitionIdChange(parseInt(v));
          }
        }}
      />
    </div>
  );
};
