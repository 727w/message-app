import * as React from "react";

// --- Konstanta ---
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 5000; // 5 detik

// --- Interface Toast ---
export interface Toast {
  id: string;
  open: boolean;
  // properti tambahan bebas
  [key: string]: any;
}

// --- State ---
interface State {
  toasts: Toast[];
}

// --- Action Types ---
export const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

// --- Discriminated Union untuk Action ---
type Action =
  | { type: typeof actionTypes.ADD_TOAST; toast: Toast }
  | { type: typeof actionTypes.UPDATE_TOAST; toast: Toast }
  | { type: typeof actionTypes.DISMISS_TOAST; toastId?: string }
  | { type: typeof actionTypes.REMOVE_TOAST; toastId?: string };

// --- Internal State Management ---
let count = 0;
function genId(): string {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const toastTimeouts = new Map<string, NodeJS.Timeout>();

let memoryState: State = { toasts: [] };
const listeners: Array<(state: State) => void> = [];

// --- Dispatch ---
function dispatch(action: Action): void {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

function addToRemoveQueue(toastId: string): void {
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: actionTypes.REMOVE_TOAST, toastId });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
}

// --- Reducer ---
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => addToRemoveQueue(toast.id));
      }
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          toastId === undefined || t.id === toastId ? { ...t, open: false } : t
        ),
      };
    }

    case actionTypes.REMOVE_TOAST:
      return {
        ...state,
        toasts: action.toastId
          ? state.toasts.filter((t) => t.id !== action.toastId)
          : [],
      };

    default:
      return state;
  }
};

// --- API untuk membuat toast ---
function createToast(props?: Partial<Toast>): {
  id: string;
  dismiss(): void;
  update(props?: Partial<Toast>): void;
} {
  const id = genId();

  const update = (props?: Partial<Toast>) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id } as Toast,
    });

  const dismiss = () =>
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...(props || {}),
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        props?.onOpenChange?.(open);
        if (!open) dismiss();
      },
    },
  });

  return { id, dismiss, update };
}

// --- Hook untuk digunakan di komponen React ---
export function useToast(): {
  toasts: Toast[];
  toast: (props?: Partial<Toast>) => void;
  dismiss: (toastId: string) => void;
} {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    toasts: state.toasts,
    toast: (props?: Partial<Toast>) => {
      createToast(props); // panggil creator
    },
    dismiss: (toastId: string) =>
      dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  };
}

// Export helper supaya bisa dipanggil langsung (tanpa hook)
export const toast = createToast;
