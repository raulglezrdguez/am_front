import { ExpressionInput } from "@/lib/types/exam";
import { useState } from "react";
import ExpressionEdit from "./ExpressionEdit";
import ExpressionCard from "./ExpressionCard";

type Props = {
  ex: ExpressionInput;
  updateExpression: (id: string, patch: Partial<ExpressionInput>) => void;
  saveExpression: (id: string) => void;
  removeExpression: (id: string) => void;
};
const ExpressionItem = ({
  ex,
  updateExpression,
  saveExpression,
  removeExpression,
}: Props) => {
  const [edit, setEdit] = useState(false);

  const handleSaveExpression = () => {
    saveExpression(ex.id);
    setEdit(false);
  };

  return edit ? (
    <ExpressionEdit
      ex={ex}
      removeExpression={removeExpression}
      saveExpression={handleSaveExpression}
      updateExpression={updateExpression}
    />
  ) : (
    <ExpressionCard
      ex={ex}
      onDelete={removeExpression}
      onEdit={() => setEdit(true)}
    />
  );
};

export default ExpressionItem;
