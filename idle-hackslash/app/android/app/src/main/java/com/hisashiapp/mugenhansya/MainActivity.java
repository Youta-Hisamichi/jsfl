package com.hisashiapp.mugenhansya;

import android.os.Bundle;
import android.webkit.WebSettings;
import com.getcapacitor.BridgeActivity;

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
    }
}
