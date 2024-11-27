<?php
require 'data.php'; // ゲームデータや修正履歴を含むファイル
include 'header.php'; // ヘッダー部分を外部ファイル化
?>

<main>
  <h1>AEARIALが公開しているもの</h1>

  <h2>Unityゲーム</h2>
  <ul>
    <?php foreach ($games as $game): ?>
      <li><?= htmlspecialchars($game['title']) ?></li>
      <p><?= htmlspecialchars($game['description']) ?></p>
      <p><?= htmlspecialchars($game['genre']) ?></p>
      <p>
        <?php foreach ($game['links'] as $label => $url): ?>
          <a href="<?= htmlspecialchars($url) ?>"><?= htmlspecialchars($label) ?></a>
        <?php endforeach; ?>
      </p>
      <br>
    <?php endforeach; ?>
  </ul>

  <h3>修正項目</h3>
  <div id="out_box">
    <?php foreach ($changelog as $version => $details): ?>
      <h4><?= htmlspecialchars($version) ?></h4>
      <?php foreach ($details as $detail): ?>
        <p><?= htmlspecialchars($detail) ?></p>
      <?php endforeach; ?>
    <?php endforeach; ?>
  </div>
</main>

<?php include 'footer.php'; ?>
