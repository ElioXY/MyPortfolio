import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, Send } from 'lucide-react'
import { useState, type FormEvent } from "react";

import {site} from '../../data/site'
import { sendMessage } from "../lib/contact";
import { useI18n } from "../lib/i18n";
import { cx } from '../lib/cx'