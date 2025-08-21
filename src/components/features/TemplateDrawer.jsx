import React, { useState, useEffect, useMemo } from 'react';
import { PlusIcon } from '../icons';
import '../../styles/TemplateDrawer.scss';
import { CustomTemplateModal } from '../ui';
import TagManagementModal from '../ui/Modal/TagManagementModal';

// Template Icon Components
const MailIcon = () => (
  <svg className="template-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
    <rect width="16.25" height="12.5" rx="1.5625" ry="1.5625" strokeWidth="1.25" strokeLinejoin="round" transform="matrix(1 0 0 1 1.875 3.75)" stroke="currentColor" fill="none"/>
    <path d="M-0.493345 -0.383713C-0.705262 -0.111248 -0.656178 0.281428 -0.383713 0.493345L5.24129 4.86835Q5.28215 4.90012 5.32767 4.92475Q5.3732 4.94937 5.42216 4.96617Q5.47112 4.98297 5.52218 4.99148Q5.57324 5 5.625 5Q5.67676 5 5.72782 4.99149Q5.77888 4.98297 5.82784 4.96617Q5.8768 4.94937 5.92233 4.92475Q5.96785 4.90012 6.00871 4.86835L11.6337 0.493345C11.9062 0.281428 11.9553 -0.111248 11.7433 -0.383713C11.5314 -0.656178 11.1388 -0.705262 10.8663 -0.493345L5.625 3.58321L0.383713 -0.493345C0.111248 -0.705262 -0.281428 -0.656178 -0.493345 -0.383713Z" fillRule="evenodd" transform="matrix(1 0 0 1 4.375 6.25)" fill="currentColor"/>
  </svg>
);

const ChatIcon = () => (
  <svg className="template-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
    <path d="M0.939481 12.8049Q0.926329 12.8533 0.929669 12.8887Q0.929299 12.8848 0.923386 12.8659Q0.901333 12.7957 0.845744 12.6985Q0.836954 12.684 0.820996 12.6601Q0.805025 12.6362 0.787867 12.6132L0.777176 12.5988L0.767324 12.5839Q0.0861384 11.5508 -0.269433 10.3656Q-0.625004 9.18037 -0.624961 7.94295Q-0.6304 6.19981 0.0564682 4.60485Q0.719058 3.06627 1.93095 1.88047Q3.14126 0.696229 4.71247 0.0468677Q6.33815 -0.625 8.1184 -0.625Q9.67173 -0.625 11.119 -0.107762Q12.5178 0.392182 13.6733 1.32202Q14.8199 2.24473 15.5927 3.48215Q16.382 4.74616 16.6888 6.19258Q16.7814 6.62446 16.8281 7.06502Q16.8749 7.50561 16.875 7.94861Q16.875 9.69564 16.2106 11.2922Q15.565 12.8435 14.3846 14.0374Q13.1973 15.2384 11.6479 15.8959Q10.0387 16.5789 8.25824 16.5789Q7.71241 16.5789 6.98594 16.4628Q6.36616 16.3638 5.88393 16.2288Q5.25771 16.0536 4.64012 15.8151Q4.59056 15.796 4.53741 15.7861Q4.48427 15.7762 4.4302 15.7762Q4.37025 15.7759 4.31311 15.7874Q4.25598 15.7989 4.20231 15.8216L4.18672 15.8282L1.52119 16.7902L1.30902 16.2023L1.55642 16.7763Q1.46933 16.8138 1.37759 16.8378Q1.28585 16.8618 1.19155 16.8716L1.15823 16.8751L1.12472 16.875Q0.707105 16.8737 0.414428 16.5759Q0.121747 16.278 0.12784 15.8604L0.128114 15.8416L0.129515 15.8229Q0.134425 15.7573 0.146234 15.6925Q0.158041 15.6278 0.176615 15.5646L0.940213 12.8022L0.939481 12.8049ZM2.14502 13.1353L1.37581 15.9174Q1.37589 15.9171 1.37595 15.9168Q1.37601 15.9165 1.37603 15.9162L0.752773 15.8695L1.37771 15.8787Q1.37923 15.7743 1.30606 15.6998Q1.23289 15.6253 1.12849 15.625L1.1266 16.25L1.06165 15.6284L1.06165 15.6284Q1.06163 15.6284 1.06163 15.6284L1.07903 15.6209L3.74646 14.6582L3.95863 15.2461L3.71496 14.6706Q3.88537 14.5984 4.0668 14.5619Q4.24822 14.5255 4.4316 14.5262Q4.60031 14.5264 4.76617 14.5572Q4.93204 14.5881 5.09042 14.649Q5.6522 14.8659 6.22083 15.0251Q6.6341 15.1407 7.18318 15.2285Q7.81165 15.3289 8.25824 15.3289Q9.78441 15.3289 11.1596 14.7453Q12.4818 14.1841 13.4957 13.1586Q14.5047 12.1381 15.0566 10.8119Q15.625 9.44592 15.625 7.94904Q15.6249 7.57197 15.5851 7.19696Q15.5453 6.82198 15.466 6.45195Q15.2049 5.22122 14.5324 4.14423Q13.8716 3.08607 12.8896 2.29585Q11.8985 1.49827 10.6983 1.06932Q9.45507 0.625 8.1184 0.625Q6.58627 0.625 5.18991 1.2021Q3.84243 1.75899 2.80516 2.77392Q1.76957 3.78722 1.20453 5.09926Q0.620404 6.45566 0.625039 7.94299Q0.625002 8.99693 0.927849 10.0064Q1.2307 11.0159 1.81088 11.8958L1.2891 12.2398L1.79034 11.8665Q1.82654 11.9151 1.86021 11.9655Q1.89388 12.0158 1.9309 12.0781Q2.27076 12.6725 2.14575 13.1326L2.14502 13.1353Z" fillRule="nonzero" transform="matrix(1 0 0 1 1.87496 1.875)" fill="currentColor"/>
  </svg>
);

const PostIcon = () => (
  <svg className="template-icon" xmlns="http://www.w3.org/2000/svg" width="19.5938" height="19.5938" viewBox="0 0 19.5938 19.5938">
    <ellipse cx="1.8369187" cy="1.7996063" rx="1.8369187" ry="1.7996063" strokeWidth="1.2246125" transform="matrix(1 0 0 1 3.06152 7.99727)" stroke="currentColor" fill="none"/>
    <ellipse cx="1.8369187" cy="1.7996063" rx="1.8369187" ry="1.7996063" strokeWidth="1.2246125" transform="matrix(1 0 0 1 12.8585 2.59845)" stroke="currentColor" fill="none"/>
    <ellipse cx="1.8369187" cy="1.7996063" rx="1.8369187" ry="1.7996063" strokeWidth="1.2246125" transform="matrix(1 0 0 1 12.8585 13.3961)" stroke="currentColor" fill="none"/>
    <path d="M7.13157 -0.295521C6.96836 -0.591693 6.59595 -0.699481 6.29978 -0.536271L-0.295521 3.09818C-0.591693 3.26139 -0.699481 3.6338 -0.536271 3.92998C-0.37306 4.22615 -0.000650525 4.33394 0.295521 4.17073L6.89082 0.536271C7.187 0.37306 7.29478 0.000650585 7.13157 -0.295521ZM-0.53627 5.1033C-0.69948 5.39947 -0.591692 5.77188 -0.295521 5.93509L6.29978 9.56954C6.59595 9.73275 6.96836 9.62497 7.13157 9.32879C7.29478 9.03262 7.187 8.66021 6.89082 8.497L0.295522 4.86255C-0.000649822 4.69934 -0.37306 4.80713 -0.53627 5.1033Z" fillRule="evenodd" transform="matrix(1 0 0 1 6.49927 5.28023)" fill="currentColor"/>
  </svg>
);

const MicIcon = () => (
  <svg className="template-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
    <path d="M0 -0.625C-0.345175 -0.625 -0.625 -0.345175 -0.625 0L-0.625 1.25Q-0.625 2.39 -0.180709 3.43579Q0.247614 4.444 1.02681 5.22319Q1.806 6.00239 2.81421 6.43071Q3.57 6.7518 4.375 6.84084L4.375 8.75L2.5 8.75C2.15482 8.75 1.875 9.02983 1.875 9.375C1.875 9.72017 2.15482 10 2.5 10L7.5 10C7.84517 10 8.125 9.72017 8.125 9.375C8.125 9.02983 7.84517 8.75 7.5 8.75L5.625 8.75L5.625 6.84084Q6.43 6.7518 7.18579 6.43071Q8.194 6.00238 8.97319 5.22319Q9.07059 5.12579 9.16251 5.02482Q9.80593 4.31797 10.1807 3.43579Q10.2362 3.30506 10.2848 3.17287Q10.625 2.2475 10.625 1.25L10.625 0C10.625 -0.345175 10.3452 -0.625 10 -0.625C9.65483 -0.625 9.375 -0.345175 9.375 0L9.375 1.25Q9.375 2.13548 9.03023 2.94702Q8.69683 3.73178 8.08931 4.33931Q8.01337 4.41525 7.93466 4.48691Q7.38369 4.98851 6.69702 5.28023Q5.88548 5.625 5 5.625Q4.11452 5.625 3.30298 5.28023Q2.51822 4.94683 1.91069 4.33931Q1.30317 3.73178 0.969772 2.94702Q0.625 2.13548 0.625 1.25L0.625 0C0.625 -0.345175 0.345175 -0.625 0 -0.625Z" fillRule="evenodd" transform="matrix(1 0 0 1 5 8.125)" fill="currentColor"/>
    <path d="M2.49689 0.625029Q1.71992 0.621115 1.17052 1.17052Q0.621114 1.71992 0.625029 2.49689L0.625037 6.83597Q0.625037 7.61417 1.1835 8.18344Q1.73933 8.75004 2.50004 8.75004Q3.2676 8.75004 3.81843 8.19328Q4.37504 7.63069 4.37504 6.83597L4.37504 2.50004Q4.37504 1.70423 3.83544 1.16463Q3.29584 0.625037 2.50004 0.625037L2.49689 0.625029ZM2.50004 -0.624963Q3.1432 -0.624963 3.72331 -0.384431Q4.28848 -0.150092 4.71932 0.280751Q5.15017 0.711594 5.3845 1.27677Q5.62504 1.85687 5.62504 2.50004L5.62504 6.83597Q5.62504 7.47914 5.37798 8.06783Q5.14006 8.63474 4.70703 9.07242Q4.27439 9.50972 3.71407 9.75035Q3.13265 10 2.50004 10Q1.86657 10 1.28206 9.74424Q0.724016 9.50002 0.291185 9.05882Q-0.13963 8.61966 -0.377485 8.05564Q-0.624963 7.4688 -0.624963 6.83597L-0.624955 2.50319Q-0.631497 1.20477 0.286635 0.286635Q1.20477 -0.631497 2.50319 -0.624955L2.50004 -0.624963Z" fillRule="nonzero" transform="matrix(1 0 0 1 7.49996 2.49996)" fill="currentColor"/>
  </svg>
);

const VidIcon = () => (
  <svg className="template-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
    <path d="M0.624987 5.94544L3.85585 8.21966L3.49609 8.73074L3.74999 8.15964Q3.75 8.15964 3.75 8.15964Q3.75 8.15964 3.75 8.15965L3.75 0.629959Q3.75 0.629966 3.75 0.629967Q3.75 0.629966 3.75 0.629967L3.49609 0.058865L3.85585 0.569945L0.624987 2.84416Q0.624998 2.84416 0.624998 2.84416Q0.625 2.84415 0.625 2.84415L0.625 5.94558Q0.625 5.94545 0.625 5.94545Q0.625 5.94545 0.624997 5.94545L0.624987 5.94544ZM-0.0945274 6.9676Q-0.343914 6.79204 -0.484424 6.52137Q-0.624936 6.25069 -0.625 5.94558L-0.625 2.84389Q-0.624938 2.53892 -0.484424 2.26824Q-0.343912 1.99756 -0.0945176 1.822L3.13634 -0.452216Q3.18633 -0.487403 3.24219 -0.512237Q3.86215 -0.787865 4.43107 -0.418194Q5 -0.0485218 5 0.629959L5 8.15965Q5 8.83813 4.43108 9.2078Q3.86216 9.57747 3.24219 9.30185Q3.18633 9.27701 3.13634 9.24182L-0.0945175 6.9676L-0.0945274 6.9676Z" fillRule="nonzero" transform="matrix(1 0 0 1 14.375 5.6052)" fill="currentColor"/>
    <path d="M9.21875 10.625L2.03125 10.625Q0.931255 10.6218 0.154706 9.8453Q-0.621843 9.06875 -0.624997 7.97054L-0.625 2.03125Q-0.621843 0.931254 0.154706 0.154706Q0.931254 -0.621844 2.02946 -0.624997L9.2375 -0.625Q10.3297 -0.621627 11.1007 0.149326Q11.8716 0.920281 11.875 2.01057L11.875 7.96875Q11.8718 9.06875 11.0953 9.8453Q10.3187 10.6218 9.22054 10.625L9.21875 10.625ZM9.21696 9.375Q9.79949 9.37333 10.2114 8.96141Q10.6233 8.54949 10.625 7.96875L10.625 2.01443Q10.6232 1.43965 10.2168 1.03321Q9.81035 0.626773 9.2375 0.625L2.03304 0.624997Q1.45051 0.62667 1.03859 1.03859Q0.626671 1.45051 0.625 2.03125L0.624997 7.96696Q0.62667 8.54949 1.03859 8.96141Q1.45051 9.37333 2.03125 9.375L9.21875 9.375L9.21696 9.375Z" fillRule="nonzero" transform="matrix(1 0 0 1 1.25 5)" fill="currentColor"/>
  </svg>
);

const DisplayIcon = () => (
  <svg className="template-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
    <path d="M14.7398 2.30827L8.90538 -0.351882Q8.30784 -0.625 7.49609 -0.625Q6.68435 -0.625 6.08628 -0.35164L0.256195 2.30834Q-0.116856 2.47791 -0.338407 2.72737Q-0.625 3.05008 -0.625 3.44512Q-0.625 3.84016 -0.338407 4.16286Q-0.116857 4.41233 0.256998 4.58226L6.03752 7.21865Q6.65595 7.50059 7.49961 7.50059Q8.34326 7.50059 8.96161 7.21869L14.7429 4.58193Q15.1161 4.41152 15.3369 4.16154Q15.6222 3.83855 15.6215 3.44378Q15.6207 3.04921 15.3344 2.72703Q15.113 2.47788 14.7398 2.30827Z" fillRule="evenodd" transform="matrix(1 0 0 1 2.50391 2.5)" fill="currentColor"/>
    <path d="M10.6797 -0.255699C10.5385 0.0592662 10.6793 0.429083 10.9943 0.570301L14.2255 2.01905L8.44308 4.65592Q8.07177 4.8252 7.49961 4.8252Q6.92745 4.8252 6.55619 4.65595L0.77563 2.01993L4.00591 0.570208C4.32082 0.428877 4.46154 0.0590096 4.32021 -0.255905C4.17888 -0.57082 3.80901 -0.71154 3.49409 -0.570208L0.25972 0.881354Q-0.116906 1.05254 -0.338485 1.30213Q-0.625 1.62487 -0.625 2.01992Q-0.625 2.41498 -0.338485 2.73771Q-0.116906 2.9873 0.256998 3.15726L6.03756 5.79327Q6.65595 6.0752 7.49961 6.0752Q8.34326 6.0752 8.96161 5.7933L14.7429 3.15695Q15.1161 2.98828 15.3386 2.73919Q15.6267 2.41678 15.6276 2.0214Q15.6286 1.62567 15.3417 1.3023Q15.1202 1.05261 14.7461 0.882583L11.5057 -0.570301C11.1907 -0.711518 10.8209 -0.570665 10.6797 -0.255699Z" fillRule="evenodd" transform="matrix(1 0 0 1 2.5 7.9875)" fill="currentColor"/>
  </svg>
);

const ArticleIcon = () => (
  <svg className="template-icon" xmlns="http://www.w3.org/2000/svg" width="18.5781" height="18.5781" viewBox="0 0 18.5781 18.5781">
    <path d="M11.0307 12.399L11.0307 0.808937Q11.0305 0.728107 10.9604 0.662983Q10.872 0.580923 10.7389 0.580564L0.870848 0.580566Q0.73927 0.580923 0.650929 0.662983Q0.580821 0.728107 0.580563 0.810751L0.580566 12.6733Q0.581546 12.9772 0.821502 13.2001Q1.07969 13.44 1.45303 13.441L13.353 13.441L13.353 14.6021L1.4498 14.6021Q0.622239 14.5998 0.0312552 14.0509Q-0.577958 13.485 -0.580566 12.6733L-0.580563 0.807122Q-0.578729 0.220428 -0.139317 -0.187744Q0.281861 -0.578979 0.870848 -0.580566L10.742 -0.580564Q11.3295 -0.578979 11.7506 -0.187744Q12.19 0.220429 12.1919 0.808937L12.1919 12.399L11.0307 12.399Z" fillRule="nonzero" transform="matrix(1 0 0 1 1.7417 2.27827)" fill="currentColor"/>
    <path d="M1.7417 11.9057Q0.792217 11.9057 0.115007 11.2766Q-0.580566 10.6305 -0.580566 9.70724L-0.580566 0Q-0.580566 -0.0571807 -0.56941 -0.113263Q-0.558255 -0.169345 -0.536373 -0.222173Q-0.51449 -0.275001 -0.482723 -0.322545Q-0.450955 -0.370089 -0.410522 -0.410522Q-0.370089 -0.450955 -0.322545 -0.482723Q-0.275001 -0.514491 -0.222173 -0.536373Q-0.169345 -0.558255 -0.113263 -0.56941Q-0.0571807 -0.580566 0 -0.580566L2.61255 -0.580566Q3.2013 -0.580566 3.62345 -0.188432Q4.06396 0.220758 4.06396 0.808937L4.06396 9.70724Q4.06396 10.6305 3.36838 11.2766Q2.69118 11.9057 1.7417 11.9057ZM1.7417 10.7445Q2.23509 10.7445 2.57814 10.4259Q2.90283 10.1243 2.90283 9.70724L2.90283 0.808937Q2.90283 0.726969 2.8332 0.662295Q2.74522 0.580566 2.61255 0.580566L0 0.580566L0 0L0.580566 0L0.580566 9.70724Q0.580566 10.1243 0.905255 10.4259Q1.24831 10.7445 1.7417 10.7445Z" fillRule="nonzero" transform="matrix(1 0 0 1 13.353 4.97473)" fill="currentColor"/>
    <path d="M4.06396 0C4.06396 0.320635 4.32389 0.580566 4.64453 0.580566L6.96679 0.580566C7.28742 0.580566 7.54735 0.320635 7.54735 0C7.54735 -0.320635 7.28742 -0.580566 6.96679 -0.580566L4.64453 -0.580566C4.32389 -0.580566 4.06396 -0.320635 4.06396 0ZM4.06396 2.15716C4.06396 2.4778 4.32389 2.73773 4.64453 2.73773L6.96679 2.73773C7.28742 2.73773 7.54735 2.4778 7.54735 2.15716C7.54735 1.83653 7.28742 1.5766 6.96679 1.5766L4.64453 1.5766C4.32389 1.5766 4.06396 1.83653 4.06396 2.15716ZM-0.580566 4.31433C-0.580566 4.63496 -0.320635 4.89489 0 4.89489L6.96679 4.89489C7.28742 4.89489 7.54735 4.63496 7.54735 4.31433C7.54735 3.99369 7.28742 3.73376 6.96679 3.73376L0 3.73376C-0.320635 3.73376 -0.580566 3.99369 -0.580566 4.31433ZM-0.580566 6.47149C-0.580566 6.79213 -0.320635 7.05206 0 7.05206L6.96679 7.05206C7.28742 7.05206 7.54735 6.79213 7.54735 6.47149C7.54735 6.15086 7.28742 5.89093 6.96679 5.89093L0 5.89093C-0.320635 5.89093 -0.580566 6.15086 -0.580566 6.47149ZM-0.580566 8.62866C-0.580566 8.94929 -0.320635 9.20922 0 9.20922L6.96679 9.20922C7.28742 9.20922 7.54735 8.94929 7.54735 8.62866C7.54735 8.30802 7.28742 8.04809 6.96679 8.04809L0 8.04809C-0.320635 8.04809 -0.580566 8.30802 -0.580566 8.62866Z" fillRule="evenodd" transform="matrix(1 0 0 1 4.06396 4.97473)" fill="currentColor"/>
    <path d="M2.90283 3.23575L0.580566 3.23575C0.420247 3.23575 0.283406 3.18309 0.170044 3.07779C0.0566813 2.97249 0 2.84538 0 2.69646L0 0.539291C0 0.39037 0.0566813 0.263258 0.170044 0.157955C0.283406 0.0526516 0.420247 0 0.580566 0L2.90283 0C3.06315 0 3.19999 0.0526514 3.31335 0.157954C3.42671 0.263257 3.48339 0.39037 3.48339 0.539291L3.48339 2.69646C3.48339 2.84538 3.42671 2.97249 3.31335 3.07779C3.19999 3.18309 3.06315 3.23575 2.90283 3.23575Z" fillRule="nonzero" transform="matrix(1 0 0 1 3.4834 4.43544)" fill="currentColor"/>
  </svg>
);

const BookIcon = () => (
  <svg className="template-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
    <path d="M8.75 2.17815Q8.02802 1.05296 6.64986 0.394513Q6.38774 0.269275 6.09704 0.159417Q4.06231 -0.609538 0.627808 -0.624988L0.627363 -0.62499Q0.107812 -0.62695 -0.259569 -0.259569Q-0.62695 0.107811 -0.624995 0.625005L-0.624995 11.7996Q-0.624995 12.3275 -0.308099 12.6997Q0.0540081 13.125 0.625007 13.125Q4.02683 13.125 5.91151 13.7834Q6.7238 14.0672 7.3205 14.4922Q7.83964 14.862 8.26178 15.3902Q8.30523 15.4446 8.35959 15.4881Q8.45667 15.5657 8.57608 15.6003Q8.69549 15.6349 8.81905 15.6212Q8.94261 15.6074 9.0515 15.5475Q9.1604 15.4875 9.23806 15.3904Q9.66292 14.8593 10.1826 14.489Q10.7792 14.0638 11.5909 13.7807Q13.4705 13.125 16.875 13.125Q17.3928 13.125 17.7589 12.7589Q18.125 12.3928 18.125 11.875L18.125 0.627364Q18.127 0.107814 17.7596 -0.25957Q17.3922 -0.626948 16.8722 -0.624988Q12.9471 -0.607387 10.8501 0.394513Q9.472 1.05296 8.75 2.17815ZM8.12501 3.8307L8.12501 13.5316Q8.08562 13.5025 8.04573 13.4741Q7.30407 12.9458 6.32375 12.6033Q4.24185 11.876 0.635276 11.875Q0.625005 11.85 0.625005 11.7996L0.625005 0.625012Q3.69001 0.639039 5.48112 1.2648Q5.81868 1.38273 6.11099 1.52239Q6.85166 1.87627 7.32918 2.38046Q7.39739 2.45249 7.46024 2.52758Q7.8905 3.04171 8.09829 3.73717Q8.11214 3.78354 8.12501 3.8307ZM16.4292 0.63042Q16.6487 0.626048 16.875 0.625012L16.875 11.875Q13.2587 11.875 11.1792 12.6005Q10.1991 12.9424 9.45716 13.471Q9.41583 13.5005 9.37501 13.5307L9.37501 3.8307Q9.58082 3.07598 10.0398 2.52758Q10.5425 1.92682 11.389 1.52239Q13.1178 0.696409 16.4292 0.63042Z" fillRule="evenodd" transform="matrix(1 0 0 1 1.24999 2.49999)" fill="currentColor"/>
  </svg>
);

const MegaIcon = () => (
  <svg className="template-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
    <path d="M13.024 0.397205Q13.3736 0.0210419 13.5708 -0.223957Q13.8162 -0.53531 14.2119 -0.606995Q14.5398 -0.666393 14.864 -0.53778Q15.1818 -0.41168 15.3861 -0.147993Q15.625 0.160513 15.625 0.546929L15.625 5.39052C15.6789 5.39056 15.7337 5.39762 15.7883 5.41238Q16.0744 5.48982 16.3346 5.7039Q16.875 6.14854 16.875 6.87505Q16.875 7.60156 16.3346 8.0462Q16.0744 8.26028 15.7883 8.33773C15.7337 8.35249 15.6789 8.35955 15.625 8.35958L15.625 13.2188Q15.625 13.6182 15.3654 13.9278Q15.1548 14.1789 14.8326 14.2962Q14.5181 14.4107 14.2053 14.3592Q13.8037 14.293 13.5683 13.9884Q13.3712 13.7429 13.0231 13.3668Q12.3146 12.6015 11.5661 11.9651Q10.5325 11.0862 9.57696 10.5904Q8.43918 10.0001 7.5 10.0001L1.25 10.0001Q0.732233 10.0001 0.366116 9.63394Q0 9.26782 0 8.75005L0 8.4563Q-0.0850494 8.37912 -0.165569 8.2835Q-0.625 7.73792 -0.625 6.87505Q-0.625 6.01218 -0.165569 5.46661Q-0.085048 5.37099 -1.11022e-16 5.29381L0 5.00005Q0 4.48229 0.366116 4.11617Q0.732233 3.75005 1.25 3.75005L7.5 3.75005Q8.43975 3.75005 9.5779 3.16196Q10.5335 2.6682 11.5671 1.79299Q12.3156 1.15927 13.024 0.397205ZM1.875 5.00005L1.25 5.00005L1.25 5.61049C1.25023 5.62016 1.25022 5.6298 1.25 5.63942L1.25 8.11069C1.25022 8.12031 1.25023 8.12995 1.25 8.13961L1.25 8.75005L1.875 8.75005L1.875 5.00005ZM3.125 8.75005L3.125 5.00005L7.5 5.00005L7.5 8.75005L3.125 8.75005ZM8.75 8.92068Q10.4454 9.37142 12.3758 11.0128Q13.1812 11.6975 13.9404 12.5176Q14.1915 12.7889 14.375 13.0036L14.375 0.7633Q14.1912 0.977474 13.9395 1.24826Q13.1803 2.065 12.3749 2.74696Q10.4449 4.38116 8.75 4.83005L8.75 8.92068Z" fillRule="evenodd" transform="matrix(1 0 0 1 1.875 1.87495)" fill="currentColor"/>
    <path d="M0.625 6.25L0.625 0C0.625 -0.345175 0.345175 -0.625 0 -0.625C-0.345175 -0.625 -0.625 -0.345175 -0.625 0L-0.625 6.5625Q-0.625 6.95082 -0.350419 7.22541Q-0.0758264 7.5 0.3125 7.5L2.38281 7.5Q3.01412 7.5002 3.38898 6.99198Q3.76383 6.48375 3.57714 5.88047Q3.48176 5.5745 3.2256 4.95209Q2.87066 4.08964 2.7317 3.5845Q2.58388 3.04717 2.53037 2.49968Q3.02855 2.48922 3.38388 2.13388Q3.75 1.76777 3.75 1.25L3.75 0.625Q3.75 0.107231 3.38388 -0.258884Q3.01777 -0.625 2.5 -0.625L1.875 -0.625C1.52982 -0.625 1.25 -0.345175 1.25 0C1.25 0.345175 1.52982 0.625 1.875 0.625L2.5 0.625L2.5 1.25L1.875 1.25Q1.81344 1.25 1.75307 1.26201Q1.69269 1.27402 1.63582 1.29758Q1.57895 1.32113 1.52777 1.35533Q1.47659 1.38953 1.43306 1.43306Q1.38953 1.47659 1.35533 1.52777Q1.32113 1.57895 1.29758 1.63582Q1.27402 1.69269 1.26201 1.75307Q1.25 1.81344 1.25 1.875Q1.25 2.91103 1.52647 3.91605Q1.68567 4.49478 2.06967 5.42781Q2.30483 5.99921 2.38301 6.25L0.625 6.25Z" fillRule="evenodd" transform="matrix(1 0 0 1 5.625 11.25)" fill="currentColor"/>
  </svg>
);

const PersonIcon = () => (
  <svg className="template-icon" xmlns="http://www.w3.org/2000/svg" width="13.9531" height="20" viewBox="0 0 13.9531 20">
    <path d="M4.49199 2.04018Q4.45199 2.53636 4.23675 2.99109Q4.03006 3.42775 3.69067 3.76679Q3.34831 4.10879 2.92378 4.29877Q2.47414 4.5 2 4.5Q1.52589 4.5 1.07611 4.29886Q0.651337 4.10889 0.308844 3.76697Q-0.0308925 3.42781 -0.237476 2.99106Q-0.452743 2.53595 -0.49205 2.03946Q-0.534061 1.50826 -0.358369 1.03128Q-0.187174 0.56651 0.166818 0.215345Q0.513997 -0.129062 0.986926 -0.314221Q1.46144 -0.5 2 -0.5Q2.53897 -0.5 3.01569 -0.310258Q3.48717 -0.1226 3.83447 0.22444Q4.187 0.576707 4.35814 1.03945Q4.53425 1.51562 4.492 2.04014L4.49199 2.04018Z" fillRule="nonzero" transform="matrix(1 0 0 1 5 4.00342)" fill="currentColor"/>
    <path d="M4.99987 0.5Q4.23781 0.5 3.51393 0.79693Q2.7675 1.10311 2.16089 1.6854Q1.51642 2.30402 1.10074 3.1687Q0.650004 4.10632 0.505562 5.25963Q0.483888 5.43264 0.53381 5.53768Q0.538376 5.54728 0.541033 5.55077Q0.536129 5.54434 0.525398 5.53607Q0.478562 5.5 0.416714 5.5L9.58303 5.5Q9.52136 5.5 9.47462 5.53598Q9.46389 5.54423 9.45898 5.55066Q9.46163 5.54719 9.4662 5.5376Q9.51611 5.43263 9.49444 5.25965Q9.34991 4.10635 8.89911 3.16872Q8.48338 2.30403 7.83889 1.68541Q7.23225 1.10311 6.48581 0.79693Q5.76193 0.5 4.99987 0.5L4.99987 0.5Z" fillRule="nonzero" transform="matrix(1 0 0 1 2 10.0034)" fill="currentColor"/>
  </svg>
);

const SearchIcon = () => (
  <svg className="template-icon" xmlns="http://www.w3.org/2000/svg" width="19" height="21.9998" viewBox="0 0 19 21.9998">
    <path d="M12.2802 16.0613C11.1516 16.6051 9.88398 16.9102 8.54432 16.9102C3.82543 16.9102 0 13.1248 0 8.45512C0 3.78548 3.82543 0 8.54432 0C13.2632 0 17.0886 3.78548 17.0886 8.45512C17.0886 10.6758 16.2235 12.6965 14.8086 14.2052L18.7011 19.5292C19.2107 20.2262 19.0528 21.1998 18.3485 21.704C17.6442 22.2082 16.6602 22.052 16.1507 21.355L12.2802 16.0613ZM14.7581 8.45504C14.7581 11.8511 11.976 14.6042 8.5441 14.6042C5.11218 14.6042 2.33005 11.8511 2.33005 8.45504C2.33005 5.05893 5.11218 2.30586 8.5441 2.30586C11.976 2.30586 14.7581 5.05893 14.7581 8.45504Z" fillRule="evenodd" transform="matrix(1 0 0 1 0 -0.000104904)" fill="currentColor"/>
  </svg>
);

const CorpIcon = () => (
  <svg className="template-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20">
    <path d="M1 -0.564453L7 -0.564453Q7.64123 -0.564453 8.09792 -0.126218Q8.56445 0.321457 8.56445 0.959583L8.56445 4.23346L12 4.23346Q12.6412 4.23346 13.0979 4.67169Q13.5645 5.11937 13.5645 5.75749L13.5645 13.4342Q13.5645 13.4897 13.5536 13.5443Q13.5428 13.5988 13.5215 13.6502Q13.5002 13.7015 13.4693 13.7477Q13.4384 13.794 13.3991 13.8333Q13.3598 13.8726 13.3136 13.9035Q13.2674 13.9344 13.216 13.9556Q13.1646 13.9769 13.1101 13.9878Q13.0556 13.9986 13 13.9986L8 13.9986Q7.97122 13.9986 7.94259 13.9957Q7.9094 13.9986 7.87502 13.9986L0 13.9986Q-0.0555938 13.9986 -0.110119 13.9878Q-0.164645 13.9769 -0.216007 13.9556Q-0.267369 13.9344 -0.313593 13.9035Q-0.359818 13.8726 -0.399129 13.8333Q-0.438439 13.794 -0.469326 13.7477Q-0.500212 13.7015 -0.521487 13.6502Q-0.542761 13.5988 -0.553607 13.5443Q-0.564453 13.4897 -0.564453 13.4342L-0.564453 0.959583Q-0.564453 0.321458 -0.0979202 -0.126219Q0.358772 -0.564453 1 -0.564453Z" fillRule="evenodd" transform="matrix(1 0 0 1 2.5 3.28283)" fill="currentColor"/>
  </svg>
);

const ShareIcon = () => (
  <svg className="template-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
    <circle cx="1.875" cy="1.875" r="1.875" strokeWidth="1.25" transform="matrix(1 0 0 1 3.125 8.125)" stroke="currentColor" fill="none"/>
    <circle cx="1.875" cy="1.875" r="1.875" strokeWidth="1.25" transform="matrix(1 0 0 1 13.125 2.5)" stroke="currentColor" fill="none"/>
    <circle cx="1.875" cy="1.875" r="1.875" strokeWidth="1.25" transform="matrix(1 0 0 1 13.125 13.75)" stroke="currentColor" fill="none"/>
    <path d="M6.42562 -0.544736C6.72647 -0.713961 7.10754 -0.607257 7.27677 -0.30641C7.44599 -0.00556311 7.33929 0.375512 7.03844 0.544736L0.30641 4.33145C0.0055632 4.50068 -0.375512 4.39398 -0.544736 4.09313C-0.713961 3.79228 -0.607257 3.41121 -0.30641 3.24198L6.42562 -0.544736ZM-0.544736 5.31859C-0.71396 5.61944 -0.607257 6.00051 -0.30641 6.16974L6.42562 9.95646C6.72647 10.1257 7.10754 10.019 7.27677 9.71813C7.44599 9.41728 7.33929 9.03621 7.03844 8.86698L0.306411 5.08026C0.00556388 4.91104 -0.375512 5.01774 -0.544736 5.31859Z" fillRule="evenodd" transform="matrix(1 0 0 1 6.63398 5.29414)" fill="currentColor"/>
  </svg>
);

const DocIcon = () => (
  <svg className="template-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
    <path d="M9 14.25L1.5 14.25Q0.568018 14.25 -0.0909914 13.591Q-0.75 12.932 -0.75 12L-0.75 1.5Q-0.75 0.568019 -0.0909898 -0.0909905Q0.56802 -0.75 1.5 -0.75L5.6895 -0.75Q5.988 -0.749936 6.26362 -0.635715Q6.53923 -0.521493 6.75016 -0.310501L10.8106 3.74992Q11.0215 3.96077 11.1357 4.23638Q11.2499 4.512 11.25 4.81034L11.25 12Q11.25 12.932 10.591 13.591Q9.93198 14.25 9 14.25ZM9 12.75Q9.31066 12.75 9.53033 12.5303Q9.75 12.3107 9.75 12L9.74992 4.81058L5.6895 0.75L1.5 0.75Q1.18934 0.75 0.96967 0.96967Q0.75 1.18934 0.75 1.5L0.75 12Q0.75 12.3107 0.969671 12.5303Q1.18934 12.75 1.5 12.75L9 12.75ZM3 7.5C2.58579 7.5 2.25 7.16421 2.25 6.75C2.25 6.33579 2.58579 6 3 6L7.5 6C7.91421 6 8.25 6.33579 8.25 6.75C8.25 7.16421 7.91421 7.5 7.5 7.5L3 7.5ZM3 10.5C2.58579 10.5 2.25 10.1642 2.25 9.75C2.25 9.33579 2.58579 9 3 9L7.5 9C7.91421 9 8.25 9.33579 8.25 9.75C8.25 10.1642 7.91421 10.5 7.5 10.5L3 10.5Z" fillRule="evenodd" transform="matrix(1 0 0 1 3.75 2.25)" fill="currentColor"/>
  </svg>
);

const MetricIcon = () => (
  <svg className="template-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
    <rect width="1.875" height="6.25" rx="0.3125" ry="0.3125" strokeWidth="1.25" strokeLinejoin="round" transform="matrix(1 0 0 1 2.5 12.5)" stroke="currentColor" fill="none"/>
    <rect width="1.875" height="10" rx="0.3125" ry="0.3125" strokeWidth="1.25" strokeLinejoin="round" transform="matrix(1 0 0 1 11.25 8.75)" stroke="currentColor" fill="none"/>
    <rect width="1.875" height="14.375" rx="0.3125" ry="0.3125" strokeWidth="1.25" strokeLinejoin="round" transform="matrix(1 0 0 1 15.625 4.375)" stroke="currentColor" fill="none"/>
    <rect width="1.875" height="17.5" rx="0.3125" ry="0.3125" strokeWidth="1.25" strokeLinejoin="round" transform="matrix(1 0 0 1 6.875 1.25)" stroke="currentColor" fill="none"/>
  </svg>
);

// Note: Using SearchIcon for filter icon as they're similar

const TemplateDrawer = ({ 
  isOpen, 
  onClose,
  onTemplateSelected,
  canManageCustomTemplates = false,
  brandBotId = 'default',
  currentUserId = 'user'
}) => {
  const [activeTab, setActiveTab] = useState('ella-templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const storageKey = useMemo(() => `brandbot:${brandBotId}:custom_templates`, [brandBotId]);
  const [savedTemplates, setSavedTemplates] = useState([]);
  
  // Tag management state
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [tagModalTemplate, setTagModalTemplate] = useState(null);

  // Tag label and variant mappings for consistent styling/colors
  const tagValueToLabel = {
    email: 'Email',
    social_post: 'Social Post',
    campaign: 'Campaign',
    press_release: 'Press Release',
    onboarding: 'Onboarding',
    launch: 'Launch',
    holiday: 'Holiday',
    linkedin: 'LinkedIn',
    facebook: 'Facebook',
    twitter: 'Twitter',
    newsletter: 'Newsletter'
  };

  const tagValueToVariant = {
    // marketing-colored tags
    email: 'marketing',
    campaign: 'marketing',
    press_release: 'marketing',
    onboarding: 'marketing',
    launch: 'marketing',
    holiday: 'marketing',
    newsletter: 'marketing',
    // social-colored tags
    social_post: 'social',
    linkedin: 'social',
    facebook: 'social',
    twitter: 'social'
  };

  // Predefined tags for the tag management modal (matching template tag values)
  const predefinedTags = [
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Social', label: 'Social' },
    { value: 'email', label: 'Email' },
    { value: 'social_post', label: 'Social Post' },
    { value: 'campaign', label: 'Campaign' },
    { value: 'press_release', label: 'Press Release' },
    { value: 'onboarding', label: 'Onboarding' },
    { value: 'launch', label: 'Launch' },
    { value: 'holiday', label: 'Holiday' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'other', label: 'Other...' }
  ];

  // Tag management functions
  const handleOpenTagModal = (template) => {
    console.log('Opening tag modal for template:', template);
    console.log('Template tags:', template.tags);
    console.log('Predefined tags:', predefinedTags.map(t => t.value));
    setTagModalTemplate(template);
    setIsTagModalOpen(true);
  };

  // Dynamic tag sizing component for template cards (160px limit)
  const TemplateDynamicTags = ({ template, onClick }) => {
    const tags = template.tags || [];
    const targetWidth = 160; // 160px limit for template cards
    const safetyMargin = 10; // Conservative margin
    const effectiveTargetWidth = targetWidth - safetyMargin;
    
    // Character width estimation (similar to SavedWorkDrawer)
    const getCharWidth = (text, fontSize) => {
      if (fontSize === 9) return text.length > 12 ? 4.5 : 4.2;
      return text.length > 12 ? 6.5 : 5.8;
    };
    
    const estimateTagWidth = (tagText, fontSize) => {
      const charWidth = getCharWidth(tagText, fontSize);
      const padding = fontSize === 9 ? 12 : 16; // padding + border
      return Math.ceil(tagText.length * charWidth + padding);
    };
    
    const estimateMoreWidth = (moreText, fontSize) => {
      const charWidth = fontSize === 9 ? 4.2 : 5.5;
      const padding = fontSize === 9 ? 12 : 16;
      return Math.ceil(moreText.length * charWidth + padding);
    };
    
    // Calculate visible tags and compact mode
    let visibleTagCount = tags.length;
    let isCompact = false;
    
    if (tags.length > 0) {
      const addTagWidth = 30; // Add tag button width
      let totalWidth = addTagWidth + 6; // Base width + gap
      
      // First try: fit all tags at 12px
      for (let i = 0; i < tags.length; i++) {
        const tagWidth = estimateTagWidth(tags[i], 12);
        if (totalWidth + tagWidth + (i > 0 ? 6 : 0) <= effectiveTargetWidth) {
          totalWidth += tagWidth + 6;
        } else {
          visibleTagCount = i;
          break;
        }
      }
      
      // Second try: if we can't fit all, try with "+X more" at 12px
      if (visibleTagCount < tags.length) {
        const remainingCount = tags.length - visibleTagCount;
        const moreText = `+${remainingCount} more`;
        const moreWidth = estimateMoreWidth(moreText, 12);
        
        totalWidth = addTagWidth + 6;
        for (let i = 0; i < tags.length; i++) {
          const tagWidth = estimateTagWidth(tags[i], 12);
          const nextWidth = totalWidth + tagWidth + 6 + moreWidth + 6;
          
          if (nextWidth <= effectiveTargetWidth) {
            totalWidth += tagWidth + 6;
            visibleTagCount = i + 1;
          } else {
            break;
          }
        }
        
        // Third try: if still not enough space, use 9px compact mode
        if (visibleTagCount === 0) {
          isCompact = true;
          totalWidth = addTagWidth + 6;
          const moreWidth9 = estimateMoreWidth(moreText, 9);
          
          for (let i = 0; i < tags.length; i++) {
            const tagWidth = estimateTagWidth(tags[i], 9);
            const nextWidth = totalWidth + tagWidth + 6 + moreWidth9 + 6;
            
            if (nextWidth <= effectiveTargetWidth) {
              totalWidth += tagWidth + 6;
              visibleTagCount = i + 1;
            } else {
              break;
            }
          }
        }
      }
    }
    
    const visibleTags = tags.slice(0, visibleTagCount);
    const hiddenTags = tags.slice(visibleTagCount);
    const shouldShowMore = hiddenTags.length > 0;
    
    return (
      <>
        <div className={`template-drawer__card-tags${isCompact ? ' template-drawer__card-tags--compact' : ''}`}>
          <button className="template-drawer__add-tag" title="Manage Tags" onClick={onClick}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
          {visibleTags.map((tag, index) => (
            <span key={index} className="template-drawer__tag-chip">{tag}</span>
          ))}
          {shouldShowMore && (
            <span 
              className="template-drawer__tag-more"
              onClick={(e) => e.stopPropagation()}
            >
              +{hiddenTags.length} more
            </span>
          )}
        </div>

      </>
    );
  };

  const handleCloseTagModal = () => {
    setIsTagModalOpen(false);
    setTagModalTemplate(null);
  };

  const handleSaveTagChanges = (templateId, newTags) => {
    console.log('Saving tag changes for template ID:', templateId, 'New tags:', newTags);
    
    // Check if it's a digital asset template
    const isDigitalAsset = digitalAssets.some(template => template.id === templateId);
    if (isDigitalAsset) {
      console.log('Updating digital asset template');
      setDigitalAssets(prev => 
        prev.map(template => 
          template.id === templateId ? { ...template, tags: newTags } : template
        )
      );
      return;
    }
    
    // Check if it's an advertising asset template
    const isAdvertisingAsset = advertisingAssets.some(template => template.id === templateId);
    if (isAdvertisingAsset) {
      console.log('Updating advertising asset template');
      setAdvertisingAssets(prev => 
        prev.map(template => 
          template.id === templateId ? { ...template, tags: newTags } : template
        )
      );
      return;
    }
    
    // Must be a saved template - update localStorage
    console.log('Updating saved template');
    setSavedTemplates(prev => 
      prev.map(template => 
        template.id === templateId ? { ...template, tags: newTags } : template
      )
    );
    
    // Update localStorage for saved templates
    const updatedTemplates = savedTemplates.map(template => 
      template.id === templateId ? { ...template, tags: newTags } : template
    );
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedTemplates));
    } catch (e) {
      console.error('Failed to save template tags:', e);
    }
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setSavedTemplates(raw ? JSON.parse(raw) : []);
    } catch (e) {
      setSavedTemplates([]);
    }
  }, [storageKey, isOpen]);

  const persistTemplates = (templates) => {
    setSavedTemplates(templates);
    try {
      localStorage.setItem(storageKey, JSON.stringify(templates));
    } catch (e) {
      // ignore
    }
  };

  const handleCreateTemplate = (data) => {
    const newTemplate = {
      id: `${Date.now()}`,
      title: data.title,
      preview: data.preview || '',
      prompt: data.prompt,
      tags: Array.isArray(data.tags) ? data.tags : [],
      createdBy: currentUserId,
      createdAt: new Date().toISOString()
    };
    const next = [newTemplate, ...savedTemplates];
    persistTemplates(next);
    setIsCreateModalOpen(false);
    setActiveTab('saved-templates');
  };

  // Digital Assets templates (now stateful to allow tag updates)
  const [digitalAssets, setDigitalAssets] = useState([
    {
      id: 1,
      icon: <MailIcon />,
      title: 'Email Campaign',
      description: 'Plan for next email campaign and outreach',
      tags: ['Marketing', 'Social']
    },
    {
      id: 2,
      icon: <ChatIcon />,
      title: 'SMS Messages',
      description: 'Plan for next email campaign and outreach',
      tags: ['Marketing', 'Social']
    },
    {
      id: 3,
      icon: <ShareIcon />,
      title: 'Social Media Post',
      description: 'Plan for next email campaign and outreach',
      tags: ['Marketing', 'Social']
    },
    {
      id: 4,
      icon: <MicIcon />,
      title: 'Podcast Script',
      description: 'Plan for next email campaign and outreach',
      tags: ['Marketing', 'Social']
    },
    {
      id: 5,
      icon: <VidIcon />,
      title: 'Video Script',
      description: 'Plan for next email campaign and outreach',
      tags: ['Marketing', 'Social']
    },
    {
      id: 6,
      icon: <VidIcon />,
      title: 'Vid Playlist Descriptions',
      description: 'Plan for next email campaign and outreach',
      tags: ['Marketing', 'Social']
    },
    {
      id: 7,
      icon: <DocIcon />,
      title: 'Landing Pages',
      description: 'Plan for next email campaign and outreach',
      tags: ['Marketing', 'Social']
    },
    {
      id: 8,
      icon: <DocIcon />,
      title: 'Website Pages',
      description: 'Plan for next email campaign and outreach',
      tags: ['Marketing', 'Social']
    },
    {
      id: 9,
      icon: <ArticleIcon />,
      title: 'Article/Blog Post',
      description: 'Plan for next email campaign and outreach',
      tags: ['Marketing', 'Social']
    },
    {
      id: 10,
      icon: <BookIcon />,
      title: 'E-Book',
      description: 'Plan for next email campaign and outreach',
      tags: ['Marketing', 'Social']
    },
    {
      id: 11,
      icon: <MetricIcon />,
      title: 'Case Studies',
      description: 'Plan for next email campaign and outreach',
      tags: ['Marketing', 'Social']
    },
    {
      id: 12,
      icon: <MegaIcon />,
      title: 'Webinar Page',
      description: 'Plan for next email campaign and outreach',
      tags: ['Marketing', 'Social']
    },
    {
      id: 13,
      icon: <PersonIcon />,
      title: 'Customer Advocacy',
      description: 'Plan for next email campaign and outreach',
      tags: ['Marketing', 'Social']
    },
    {
      id: 14,
      icon: <SearchIcon />,
      title: 'SEO Optimization',
      description: 'Plan for next email campaign and outreach',
      tags: ['Marketing', 'Social']
    },
    {
      id: 15,
      icon: <CorpIcon />,
      title: 'Thought Leadership',
      description: 'Plan for next email campaign and outreach',
      tags: ['Marketing', 'Social']
    }
  ]);

  // Advertising Assets templates (now stateful to allow tag updates)
  const [advertisingAssets, setAdvertisingAssets] = useState([
    {
      id: 16,
      icon: <SearchIcon />,
      title: 'Search Engine Ads',
      description: 'Plan for next email campaign and outreach',
      tags: ['Marketing', 'Social']
    },
    {
      id: 17,
      icon: <ShareIcon />,
      title: 'Social Media Ads',
      description: 'Plan for next email campaign and outreach',
      tags: ['Marketing', 'Social']
    },
    {
      id: 18,
      icon: <DisplayIcon />,
      title: 'Display Ads',
      description: 'Plan for next email campaign and outreach',
      tags: ['Marketing', 'Social']
    },
    {
      id: 19,
      icon: <VidIcon />,
      title: 'Video Ads',
      description: 'Plan for next email campaign and outreach',
      tags: ['Marketing', 'Social']
    }
  ]);

  // Close drawer when clicking outside
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const renderTemplateCard = (template) => (
    <div key={template.id} className="template-drawer__card">
      <div className="template-drawer__card-left-edge"></div>
      <div className="template-drawer__card-content">
        <div className="template-drawer__card-header">
                  <div className="template-drawer__card-title-section">
          <div className="template-drawer__card-icon">
            {template.icon}
          </div>
          <h3 className="template-drawer__card-title">{template.title}</h3>
        </div>
          <div className="template-drawer__card-info-container">
            <svg 
              className="template-drawer__card-info-icon"
              xmlns="http://www.w3.org/2000/svg" 
              width="15" 
              height="15" 
              viewBox="0 0 512 512"
              style={{ fill: 'var(--theme-primary-deep, #E6A429)' }}
            >
              <g>
                <path d="M322.4,173.9l-129,16.2l-4.6,21.4l25.3,4.7c16.5,3.9,19.8,9.9,16.2,26.4l-41.5,195.3c-10.9,50.5,5.9,74.3,45.5,74.3
                  c30.7,0,66.3-14.2,82.5-33.6l4.9-23.4c-11.3,9.9-27.7,13.9-38.6,13.9c-15.5,0-21.1-10.9-17.1-30L322.4,173.9z"/>
                <circle cx="270.1" cy="56.3" r="56.3"/>
              </g>
            </svg>
            <div className="template-drawer__card-tooltip">
              <div className="template-drawer__card-tooltip-content">
                <h4>{template.title}</h4>
                <p>{template.description}</p>
                <div className="template-drawer__card-tooltip-tags">
                  {template.tags.map((tag, index) => (
                    <span key={index} className={`template-drawer__card-tooltip-tag template-drawer__card-tooltip-tag--${tag.toLowerCase()}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="template-drawer__card-description">{template.description}</p>
        <div className="template-drawer__card-footer">
          <TemplateDynamicTags 
            template={template} 
            onClick={(e) => { e.stopPropagation(); handleOpenTagModal(template); }}
          />
          <div className="template-drawer__card-rating">
            <svg height="14" viewBox="0 0 90.44 109.83" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id={`ellaLogoGradient-${template.id}`} x1="45.22" y1="-20.72" x2="45.22" y2="71.87" gradientTransform="translate(0 82.04) scale(1 -1)" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#fed830"/>
                  <stop offset="1" stopColor="#fbaf17"/>
                </linearGradient>
              </defs>
              <path d="M70.97,10.16H19.47c-6.05,0-10.93,4.9-10.93,10.93v51.5c0,6.05,4.9,10.93,10.93,10.93v18.76c0,.42.51.64.8.33l19.08-19.08h31.62c6.05,0,10.93-4.9,10.93-10.93V21.09c0-6.05-4.9-10.93-10.93-10.93ZM49.93,66.65l-3.28-8.07h-14.8l-3.17,8.07h-9.26l16.49-38.13h6.94l16.58,38.13h-9.48s-.02,0-.02,0ZM70.4,66.65h-8.07v-26.17h8.07v26.17ZM69.66,35.54c-.91.91-2.03,1.37-3.32,1.37s-2.4-.46-3.32-1.37-1.37-2.03-1.37-3.32.46-2.4,1.37-3.32,2.03-1.37,3.32-1.37,2.4.46,3.32,1.37,1.37,2.03,1.37,3.32-.46,2.4-1.37,3.32Z" fill={`url(#ellaLogoGradient-${template.id})`} />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="template-drawer__backdrop" 
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`template-drawer ${isOpen ? 'template-drawer--open' : ''}`}>
        <div className="template-drawer__container">
          {/* Header Tabs */}
          <div className="template-drawer__header">
            <div className="template-drawer__tabs">
              <button 
                className={`template-drawer__tab ${activeTab === 'special-additions' ? 'template-drawer__tab--active' : ''}`}
                onClick={() => setActiveTab('special-additions')}
              >
                Special Edition Templates
              </button>
              <button 
                className={`template-drawer__tab ${activeTab === 'ella-templates' ? 'template-drawer__tab--active' : ''}`}
                onClick={() => setActiveTab('ella-templates')}
              >
                All Templates
              </button>
              <button 
                className={`template-drawer__tab ${activeTab === 'saved-templates' ? 'template-drawer__tab--active' : ''}`}
                onClick={() => setActiveTab('saved-templates')}
              >
                Custom Templates
              </button>
            </div>
          </div>

          {/* Browse Text */}
          <div className="template-drawer__browse-text">
            Browse all available...
          </div>

          {/* Search and Actions */}
          <div className="template-drawer__search-section">
            <div className="template-drawer__search-container">
              <div className="template-drawer__search-icon">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="template-drawer__search-input"
              />
            </div>
            <button className="template-drawer__filter-btn">
              <div className="template-drawer__filter-icon">
                <SearchIcon />
              </div>
              <span>Filter</span>
            </button>
            {activeTab === 'saved-templates' && canManageCustomTemplates && (
              <button className="template-drawer__new-btn" onClick={() => setIsCreateModalOpen(true)}>
              <PlusIcon />
              <span>New</span>
            </button>
            )}
          </div>

          {/* Content */}
          <div className="template-drawer__content">
            {activeTab === 'ella-templates' && (
              <>
                {/* Digital Assets Section */}
                <div className="template-drawer__section">
                  <h2 className="template-drawer__section-title">Digital Assets</h2>
                  <div className="template-drawer__grid">
                    {digitalAssets.slice(0, 12).map(renderTemplateCard)}
                  </div>
                </div>

                {/* Advertising Assets Section */}
                <div className="template-drawer__section">
                  <h2 className="template-drawer__section-title">Advertising Assets</h2>
                  <div className="template-drawer__grid">
                    {advertisingAssets.map(renderTemplateCard)}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'special-additions' && (
              <div className="template-drawer__section">
                <h2 className="template-drawer__section-title">Special Addition Templates</h2>
                <div className="template-drawer__grid">
                  {digitalAssets.slice(0, 6).map((template) => (
                    <div 
                      key={template.id} 
                      className="template-drawer__card"
                      onClick={() => { 
                        if (onTemplateSelected) onTemplateSelected(template.prompt || template.title); 
                        if (onClose) onClose(); 
                      }}
                    >
                      <div className="template-drawer__card-left-edge"></div>
                      <div className="template-drawer__card-content">
                        <div className="template-drawer__card-header">
                          <div className="template-drawer__card-title-section">
                            <div className="template-drawer__card-icon">
                              {template.icon}
                            </div>
                            <h3 className="template-drawer__card-title">{template.title}</h3>
                          </div>
                          <div className="template-drawer__card-info-container">
                            <svg 
                              className="template-drawer__card-info-icon"
                              xmlns="http://www.w3.org/2000/svg" 
                              width="15" 
                              height="15" 
                              viewBox="0 0 512 512"
                              style={{ fill: 'var(--theme-primary-deep, #E6A429)' }}
                            >
                              <g>
                                <path d="M322.4,173.9l-129,16.2l-4.6,21.4l25.3,4.7c16.5,3.9,19.8,9.9,16.2,26.4l-41.5,195.3c-10.9,50.5,5.9,74.3,45.5,74.3
                                  c30.7,0,66.3-14.2,82.5-33.6l4.9-23.4c-11.3,9.9-27.7,13.9-38.6,13.9c-15.5,0-21.1-10.9-17.1-30L322.4,173.9z"/>
                                <circle cx="270.1" cy="56.3" r="56.3"/>
                              </g>
                            </svg>
                            <div className="template-drawer__card-tooltip">
                              <div className="template-drawer__card-tooltip-content">
                                <h4>{template.title}</h4>
                                <p>{template.description}</p>
                                <div className="template-drawer__card-tooltip-tags">
                                  {template.tags.map((tag, index) => (
                                    <span key={index} className={`template-drawer__card-tooltip-tag template-drawer__card-tooltip-tag--${tag.toLowerCase()}`}>
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="template-drawer__card-description">{template.description}</p>
                        <div className="template-drawer__card-footer">
                          <TemplateDynamicTags 
                            template={template} 
                            onClick={(e) => { e.stopPropagation(); handleOpenTagModal(template); }}
                          />
                          <div className="template-drawer__card-rating">
                            <svg height="14" viewBox="0 0 90.44 90.68" xmlns="http://www.w3.org/2000/svg">
                              <defs>
                                <style>
                                  {`.cls-1{fill:#fbfcfc;}.cls-2{fill:#0f3e65;}.cls-3{fill:#00bae3;}`}
                                </style>
                              </defs>
                              <g id="IZHrlL.tif">
                                <path className="cls-2" d="M85.5,3.96v67.23c-.65,7.82-6.85,14.03-14.68,14.67H3.6s0-68.12,0-68.12c.42-1.27.63-2.61,1.12-3.86,1.78-4.5,5.7-7.98,10.34-9.31l2.46-.61h67.98ZM14.25,36.11c-.12.73,0,2.06,0,2.87,0,.01.19.2.2.2h8.05c.95,0,2.48,1.1,3.07,1.85,2.01,2.55,1.51,7.02-1.37,8.72-.29.17-1.3.63-1.56.63h-8.19s-.2.19-.2.2v2.87c0,.58.84,1.37,1.43,1.44,2.03.24,7.13.13,9.08-.34,9.81-2.4,9.82-17.08,0-19.52-1.94-.48-7.06-.58-9.08-.34-.66.08-1.32.79-1.43,1.44ZM49.46,34.68h-15.08c-.72,0-1.84,1.42-1.84,2.12v2.12h15.36c.35,0,1.57-1.22,1.57-1.57v-2.66ZM58.68,34.68h-6.07v20.34h2.66c.53,0,1.62-.77,1.9-1.24.05-.09.35-.83.35-.88v-10.99l4.2,9.93c.91,1.5,2.83,1.73,3.96.36l4.25-9.87v12.7h2.53c.35,0,1.38-.52,1.64-.81.21-.23.74-1.31.74-1.58v-17.95h-5.94c-.34,0-1.07.74-1.26,1.06l-3.79,9.18-3.84-9.13c-.18-.45-.89-1.03-1.35-1.11ZM38.54,55.15h3.21c.72,0,1.84-1.42,1.84-2.12v-12.01s-.19-.2-.2-.2h-3.14c-.62,0-1.71.95-1.71,1.57v12.76Z"/>
                                <path className="cls-3" d="M58.68,34.68c.46.08,1.16.66,1.35,1.11l3.84,9.13,3.79-9.18c.19-.32.92-1.06,1.26-1.06h5.94v17.95c0,.26-.53,1.34-.74,1.58-.27.29-1.29.81-1.64.81h-2.53v-12.7l-4.25,9.87c-1.14,1.37-3.06,1.14-3.96-.36l-4.2-9.93v10.99s-.3.79-.35.88c-.28.47-1.37,1.24-1.9,1.24h-2.66v-20.34h6.07Z"/>
                                <path className="cls-1" d="M14.25,36.11c.11-.65.77-1.36,1.43-1.44,2.02-.24,7.14-.14,9.08.34,9.82,2.44,9.81,17.13,0,19.52-1.95.48-7.05.58-9.08.34-.59-.07-1.43-.86-1.43-1.44v-2.87s.19-.2.2-.2h8.19c.26,0,1.27-.46,1.56-.63,2.89-1.7,3.38-6.17,1.37-8.72-.59-.75-2.12-1.85-3.07-1.85h-8.05s-.2-.19-.2-.2c0-.81-.12-2.14,0-2.87Z"/>
                                <path className="cls-1" d="M38.54,55.15v-12.76c0-.62,1.08-1.57,1.71-1.57h3.14s.2.19.2.2v12.01c0,.69-1.13,2.12-1.84,2.12h-3.21Z"/>
                                <path className="cls-1" d="M49.46,34.68v2.66c0,.35-1.22,1.57-1.57,1.57h-15.36v-2.12c0-.69,1.13-2.12,1.84-2.12h15.08Z"/>
                              </g>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'saved-templates' && (
              <div className="template-drawer__section">
                <h2 className="template-drawer__section-title">Saved Templates</h2>
                <div className="template-drawer__grid">
                  {savedTemplates
                    .filter(t =>
                      !searchQuery ||
                      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (t.preview || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (t.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map((template) => (
                      <div
                        key={template.id}
                        className="template-drawer__card"
                        onClick={() => { onTemplateSelected && onTemplateSelected(template.prompt); onClose && onClose(); }}
                      >
                        <div className="template-drawer__card-left-edge"></div>
                        <div className="template-drawer__card-content">
                          <div className="template-drawer__card-header">
                            <div className="template-drawer__card-title-section">
                              <div className="template-drawer__card-icon">
                                <DocIcon />
                              </div>
                              <h3 className="template-drawer__card-title">{template.title}</h3>
                            </div>
                            <div className="template-drawer__card-info-container" onClick={(e) => e.stopPropagation()}>
                              <svg 
                                className="template-drawer__card-info-icon"
                                xmlns="http://www.w3.org/2000/svg" 
                                width="15" 
                                height="15" 
                                viewBox="0 0 512 512"
                                style={{ fill: 'var(--theme-primary-deep, #E6A429)' }}
                              >
                                <g>
                                  <path d="M322.4,173.9l-129,16.2l-4.6,21.4l25.3,4.7c16.5,3.9,19.8,9.9,16.2,26.4l-41.5,195.3c-10.9,50.5,5.9,74.3,45.5,74.3
                                    c30.7,0,66.3-14.2,82.5-33.6l4.9-23.4c-11.3,9.9-27.7,13.9-38.6,13.9c-15.5,0-21.1-10.9-17.1-30L322.4,173.9z"/>
                                  <circle cx="270.1" cy="56.3" r="56.3"/>
                                </g>
                              </svg>
                              <div className="template-drawer__card-tooltip">
                                <div className="template-drawer__card-tooltip-content">
                                  <h4>{template.title}</h4>
                                  <p>{template.preview || 'Custom template'}</p>
                                  <div className="template-drawer__card-tooltip-tags">
                                  {(template.tags || []).map((tagValue, index) => {
                                    const variant = tagValueToVariant[tagValue];
                                    const label = tagValueToLabel[tagValue] || tagValue.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                                    const cls = variant
                                      ? `template-drawer__card-tooltip-tag template-drawer__card-tooltip-tag--${variant}`
                                      : 'template-drawer__card-tooltip-tag';
                                    return (
                                      <span key={index} className={cls}>{label}</span>
                                    );
                                  })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="template-drawer__card-description">{template.preview || 'Custom template'}</p>
                          <div className="template-drawer__card-footer">
                            <TemplateDynamicTags 
                              template={{
                                ...template,
                                tags: (template.tags || []).map(tagValue => 
                                  tagValueToLabel[tagValue] || tagValue.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                                )
                              }} 
                              onClick={(e) => { e.stopPropagation(); handleOpenTagModal(template); }}
                            />
                            <div className="template-drawer__card-rating">
                              <svg height="14" viewBox="0 0 90.44 109.83" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                  <linearGradient id={`ellaLogoGradient-custom-${template.id}`} x1="45.22" y1="-20.72" x2="45.22" y2="71.87" gradientTransform="translate(0 82.04) scale(1 -1)" gradientUnits="userSpaceOnUse">
                                    <stop offset="0" stopColor="#fed830"/>
                                    <stop offset="1" stopColor="#fbaf17"/>
                                  </linearGradient>
                                </defs>
                                <path d="M70.97,10.16H19.47c-6.05,0-10.93,4.9-10.93,10.93v51.5c0,6.05,4.9,10.93,10.93,10.93v18.76c0,.42.51.64.8.33l19.08-19.08h31.62c6.05,0,10.93-4.9,10.93-10.93V21.09c0-6.05-4.9-10.93-10.93-10.93ZM49.93,66.65l-3.28-8.07h-14.8l-3.17,8.07h-9.26l16.49-38.13h6.94l16.58,38.13h-9.48s-.02,0-.02,0ZM70.4,66.65h-8.07v-26.17h8.07v26.17ZM69.66,35.54c-.91.91-2.03,1.37-3.32,1.37s-2.4-.46-3.32-1.37-1.37-2.03-1.37-3.32.46-2.4,1.37-3.32,2.03-1.37,3.32-1.37,2.4.46,3.32,1.37,1.37,2.03,1.37,3.32-.46,2.4-1.37,3.32Z" fill={`url(#ellaLogoGradient-custom-${template.id})`} />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  {savedTemplates.length === 0 && (
                    <div className="template-drawer__empty">No custom templates yet.</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="template-drawer__footer">
            <button 
              className="template-drawer__close-btn"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Create Custom Template Modal */}
      <CustomTemplateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateTemplate}
      />

      {/* Tag Management Modal */}
      <TagManagementModal
        isOpen={isTagModalOpen}
        onClose={handleCloseTagModal}
        onSave={handleSaveTagChanges}
        document={tagModalTemplate}
        predefinedTags={predefinedTags}
      />
    </>
  );
};

export default TemplateDrawer; 