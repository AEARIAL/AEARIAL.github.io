<?php
include 'data.php'; // ゲームデータを読み込む

foreach ($games as $game) {
    echo '<section>';
    echo '<h2>' . htmlspecialchars($game['title']) . '</h2>';
    echo '<p>' . htmlspecialchars($game['description']) . '</p>';
    echo '<p>' . htmlspecialchars($game['genre']) . '</p>';
    echo '<p><a href="' . htmlspecialchars($game['link']) . '">' . htmlspecialchars($game['title']) . 'をプレイ(' . htmlspecialchars($game['version']) . ')</a></p>';

    // オプションリンクが存在する場合のみ表示
    if (isset($game['rule_link'])) {
        echo '<p><a href="' . htmlspecialchars($game['rule_link']) . '">ルールを見る</a></p>';
    }
    if (isset($game['cost_tool'])) {
        echo '<p><a href="' . htmlspecialchars($game['cost_tool']) . '">コスト計算ツール</a></p>';
    }
    echo '</section>';
}
?>
