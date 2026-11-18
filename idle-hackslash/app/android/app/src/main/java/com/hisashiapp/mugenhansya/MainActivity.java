package com.hisashiapp.mugenhansya;

import android.os.Bundle;
import android.webkit.WebSettings;
import com.getcapacitor.BridgeActivity;
import com.google.android.gms.ads.MobileAds;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // タブレット：ゲームの index.html が指定する viewport の幅を使い、画面いっぱいに拡大して表示する（指定しないと Android の WebView は幅の指定を無視する）
        try {
            WebSettings s = getBridge().getWebView().getSettings();
            s.setUseWideViewPort(true);
            s.setLoadWithOverviewMode(true);
        } catch (Exception e) {
            // 失敗しても、いつもの大きさで表示されるだけ
        }
        // AdMob の立ち上げは重いので、画面のスレッドではなく裏のスレッドで先に済ませておく（Google の推奨）。
        // プラグインの initialize() は画面のスレッドで MobileAds.initialize を呼ぶため、ここで済ませておかないとゲームの画面が10秒近く固まる。
        final android.content.Context app = getApplicationContext();
        new Thread(() -> {
            try { MobileAds.initialize(app, status -> {}); } catch (Throwable t) { /* 立ち上げに失敗しても、広告を見るときにプラグインがもう一度試す */ }
        }, "admob-init").start();
    }
}
