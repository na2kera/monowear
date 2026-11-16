import styles from './SizeChart.module.css'

// ANTI-PATTERN #8: 別タブで開く単独ページ。ヘッダーもなく、元の商品に戻る導線もない。
// 服は列ごとに cm とインチが混在。靴は US サイズとインチだけで、詳細画面の「26.5」などの cm 表記と対応づけられない。
export default function SizeChart() {
  return (
    <div className={styles.page}>
      <h1>SIZE GUIDE / サイズガイド</h1>

      <h2>TOPS / OUTER</h2>
      <table>
        <thead>
          <tr>
            <th>SIZE</th>
            <th>着丈 (cm)</th>
            <th>身幅 (inch)</th>
            <th>肩幅 (cm)</th>
            <th>袖丈 (inch)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>XS</td><td>64</td><td>19.3</td><td>42</td><td>7.1</td></tr>
          <tr><td>S</td><td>67</td><td>20.1</td><td>44</td><td>7.5</td></tr>
          <tr><td>M</td><td>70</td><td>21.3</td><td>46</td><td>7.9</td></tr>
          <tr><td>L</td><td>73</td><td>22.4</td><td>48</td><td>8.3</td></tr>
          <tr><td>XL</td><td>76</td><td>23.6</td><td>50</td><td>8.7</td></tr>
        </tbody>
      </table>

      <h2>BOTTOMS</h2>
      <table>
        <thead>
          <tr>
            <th>SIZE</th>
            <th>WAIST (inch)</th>
            <th>股下 (cm)</th>
            <th>HIP (inch)</th>
            <th>裾幅 (cm)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>XS</td><td>27</td><td>72</td><td>35</td><td>16</td></tr>
          <tr><td>S</td><td>29</td><td>74</td><td>37</td><td>17</td></tr>
          <tr><td>M</td><td>31</td><td>76</td><td>39</td><td>18</td></tr>
          <tr><td>L</td><td>33</td><td>78</td><td>41</td><td>19</td></tr>
          <tr><td>XL</td><td>35</td><td>80</td><td>43</td><td>20</td></tr>
        </tbody>
      </table>

      <h2>SHOES</h2>
      <table>
        <thead>
          <tr>
            <th>US</th>
            <th>UK</th>
            <th>EU</th>
            <th>FOOT LENGTH (inch)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>5</td><td>4</td><td>37</td><td>9.0</td></tr>
          <tr><td>6</td><td>5</td><td>38</td><td>9.4</td></tr>
          <tr><td>7</td><td>6</td><td>39-40</td><td>9.8</td></tr>
          <tr><td>8</td><td>7</td><td>41</td><td>10.2</td></tr>
          <tr><td>9</td><td>8</td><td>42</td><td>10.6</td></tr>
          <tr><td>10</td><td>9</td><td>43-44</td><td>11.0</td></tr>
          <tr><td>11</td><td>10</td><td>45</td><td>11.4</td></tr>
        </tbody>
      </table>

      <p className={styles.note}>
        ※ 商品により多少の誤差がございます。※ 実寸は平置きで採寸しています。※ 一部商品は上記と異なる場合がございます。
      </p>
    </div>
  )
}
