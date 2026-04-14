"use client";

// Smartlink - Adsterra 智能链接
// 点击时有时显示广告，有时直接跳转目标页面
// 让 Adsterra 处理跳转逻辑

interface SmartlinkProps {
  className?: string;
  children: React.ReactNode;
}

export function Smartlink({ className, children }: SmartlinkProps) {
  const smartlinkUrl = "https://developdomicile.com/cgfzstgbwy?key=55b7f459c07f4e222cc1247f35482b27";

  return (
    <a
      href={smartlinkUrl}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}